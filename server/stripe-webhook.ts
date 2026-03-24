import type { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { payments, simulations } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendReportEmail, sendEbookEmail } from "./emailService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// In-memory set to prevent duplicate event processing within the same invocation
const processedEvents = new Set<string>();

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event received, skipping processing");
    return res.json({ verified: true });
  }

  // Idempotency: skip already-processed events within this invocation
  if (processedEvents.has(event.id)) {
    console.log(`[Webhook] Duplicate event ${event.id}, skipping`);
    return res.json({ received: true });
  }
  processedEvents.add(event.id);

  console.log(`[Webhook] Received event ${event.type} (${event.id})`);

  // Respond immediately to avoid Stripe retry due to timeout
  res.json({ received: true });

  // Fire-and-forget: process the event asynchronously after responding
  processEvent(event).catch((err) => {
    console.error(`[Webhook] Unhandled error processing ${event.type} (${event.id}): ${err.message ?? err}`);
  });
}

async function processEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Webhook] Processing checkout.session.completed – session ${session.id}`);
      try {
        await handleCheckoutCompleted(session);
      } catch (err: any) {
        console.error(`[Webhook] Error in handleCheckoutCompleted (session ${session.id}): ${err.message}`);
      }
      break;
    }
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Processing payment_intent.succeeded – PI ${pi.id}, amount ${pi.amount}, status ${pi.status}`);
      try {
        const db = await getDb();
        if (db) {
          await db.update(payments)
            .set({ status: "succeeded", updatedAt: new Date() })
            .where(eq(payments.stripePaymentIntentId, pi.id));
          console.log(`[Webhook] Updated payment status to succeeded for PI ${pi.id}`);
        }
      } catch (err: any) {
        console.error(`[Webhook] Error updating payment_intent.succeeded (PI ${pi.id}): ${err.message}`);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const failureMessage = pi.last_payment_error?.message ?? "unknown";
      console.log(`[Webhook] Processing payment_intent.payment_failed – PI ${pi.id}, reason: ${failureMessage}`);
      try {
        const db = await getDb();
        if (db) {
          await db.update(payments)
            .set({ status: "failed", updatedAt: new Date() })
            .where(eq(payments.stripePaymentIntentId, pi.id));
          console.log(`[Webhook] Updated payment status to failed for PI ${pi.id}`);
        }
      } catch (err: any) {
        console.error(`[Webhook] Error updating payment_intent.payment_failed (PI ${pi.id}): ${err.message}`);
      }
      break;
    }
    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const simulationId = session.metadata?.simulation_id;
  const productType = session.metadata?.product_type;
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email || "";
  const customerName = session.metadata?.customer_name || "";

  console.log(`[Webhook] Checkout details – session ${session.id}, simulationId=${simulationId}, product=${productType}, email=${customerEmail}`);

  const db = await getDb();

  // Update payment record by session ID, with fallback to simulation ID
  if (session.payment_intent && db) {
    const piId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
    const updateData = {
      stripeSessionId: session.id,
      stripePaymentIntentId: piId,
      status: "succeeded" as const,
      updatedAt: new Date(),
    };

    // Try to update by session ID first
    const result = await db.update(payments)
      .set(updateData)
      .where(eq(payments.stripeSessionId, session.id));

    const rowsUpdated = (result as any)?.[0]?.affectedRows ?? (result as any)?.rowsAffected ?? 0;

    if (rowsUpdated === 0 && simulationId) {
      // Fallback: find the simulation by publicId, then update the payment by simulationId
      console.log(`[Webhook] No payment found by session ${session.id}, trying fallback via simulation publicId ${simulationId}`);
      const simRows = await db.select({ id: simulations.id })
        .from(simulations)
        .where(eq(simulations.publicId, simulationId))
        .limit(1);

      if (simRows.length > 0) {
        await db.update(payments)
          .set(updateData)
          .where(eq(payments.simulationId, simRows[0].id));
        console.log(`[Webhook] Updated payment via simulationId ${simRows[0].id} (fallback)`);
      } else {
        console.warn(`[Webhook] No payment or simulation found for session ${session.id} / simulation ${simulationId}`);
      }
    } else {
      console.log(`[Webhook] Payment updated by session ${session.id} (PI ${piId})`);
    }
  }

  // Handle report (PREMIUM product)
  if (simulationId && (productType === "PREMIUM" || productType === "premium") && db) {
    const simResults = await db.select().from(simulations).where(eq(simulations.publicId, simulationId)).limit(1);
    if (simResults.length > 0) {
      const sim = simResults[0];
      await db.update(simulations).set({ status: "completed", updatedAt: new Date() }).where(eq(simulations.id, sim.id));
      console.log(`[Webhook] Simulation ${simulationId} marked as completed`);
      // Send report email
      if (sim.reportUrl && customerEmail) {
        await sendReportEmail({
          to: customerEmail,
          name: customerName || sim.fullName || "Client",
          reportUrl: sim.reportUrl,
          operationType: sim.operationType,
          country: sim.country,
        });
        console.log(`[Webhook] Report email sent to ${customerEmail}`);
      }
    } else {
      console.warn(`[Webhook] Simulation ${simulationId} not found for PREMIUM report delivery`);
    }
  }

  // Handle ebook (PACK_COMPLET)
  if ((productType === "PACK_COMPLET" || productType === "pack_complet") && customerEmail) {
    const ebookUrl = process.env.EBOOK_PDF_URL || `${process.env.APP_URL || ""}/ebook/guide-fiscal-europeen.pdf`;
    await sendEbookEmail({ to: customerEmail, name: customerName, ebookUrl });
    console.log(`[Webhook] Ebook email sent to ${customerEmail}`);
  }

  console.log(`[Webhook] Checkout completed for ${customerEmail} (session ${session.id})`);
}
