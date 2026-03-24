import { SimulationResult } from "./fiscal/types";

export async function generatePDF(simulationId: string, data: Record<string, unknown>, result: SimulationResult): Promise<Buffer> {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ─── Brand colours ───────────────────────────────────────────────
  const NAVY = [15, 23, 42] as [number, number, number];
  const GOLD = [217, 119, 6] as [number, number, number];
  const LIGHT = [241, 245, 249] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];

  // ─── Header ──────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("JEVALIS", margin, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Analyse Fiscale Immobilière Européenne", margin, 26);
  doc.setFontSize(8);
  doc.text(`Rapport généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, 33);
  doc.text(`Référence : ${simulationId}`, pageW - margin, 33, { align: "right" });
  y = 50;

  // ─── Country + Title ─────────────────────────────────────────────
  doc.setTextColor(...NAVY);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Analyse fiscale — ${result.countryName}`, margin, y);
  y += 8;

  doc.setFillColor(...GOLD);
  doc.rect(margin, y, contentW, 1, "F");
  y += 6;

  // ─── Input summary ───────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Paramètres de la simulation", margin, y);
  y += 6;

  const inputRows: [string, string][] = [
    ["Pays", result.countryName],
    ["Valeur du bien", `${((data.propertyValue as number) || 0).toLocaleString("fr-FR")} €`],
    ["Type de bien", String(data.propertyType || "")],
    ["Revenus locatifs annuels", `${((data.annualRentalIncome as number) || 0).toLocaleString("fr-FR")} €`],
    ["Durée de détention", `${data.ownershipYears} ans`],
    ["Résident", data.isResident ? "Oui" : "Non"],
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  inputRows.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139);
    doc.text(label, margin, y);
    doc.setTextColor(...NAVY);
    doc.text(value, margin + 70, y);
    y += 6;
  });
  y += 4;

  // ─── Tax breakdown ───────────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.rect(margin, y - 2, contentW, 8, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Décomposition fiscale", margin + 2, y + 4);
  y += 12;

  doc.setFontSize(9);
  result.breakdown.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3, contentW, 7, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(item.label, margin + 2, y + 2);
    const amtColor = item.amount < 0 ? ([22, 163, 74] as [number, number, number]) : NAVY;
    doc.setTextColor(...amtColor);
    doc.setFont("helvetica", "bold");
    doc.text(`${item.amount.toLocaleString("fr-FR")} €`, pageW - margin - 2, y + 2, { align: "right" });
    if (item.note) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(item.note, pageW - margin - 30, y + 2, { align: "right" });
      doc.setFontSize(9);
    }
    y += 8;
  });

  // Total
  doc.setFillColor(...NAVY);
  doc.rect(margin, y, contentW, 10, "F");
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL CHARGES FISCALES", margin + 2, y + 7);
  doc.text(`${result.totalTax.toLocaleString("fr-FR")} €`, pageW - margin - 2, y + 7, { align: "right" });
  y += 16;

  // ─── Key metrics ─────────────────────────────────────────────────
  const metrics = [
    { label: "Taux effectif global", value: `${result.effectiveRate} %` },
    { label: "Rendement brut", value: `${result.grossYield} %` },
    { label: "Rendement net après impôts", value: `${result.netYield} %` },
    { label: "Revenu net annuel", value: `${result.netReturn.toLocaleString("fr-FR")} €` },
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Indicateurs clés", margin, y);
  y += 6;

  const colW = contentW / 2 - 3;
  metrics.forEach((m, i) => {
    const x = margin + (i % 2) * (colW + 6);
    if (i % 2 === 0 && i > 0) y += 14;
    doc.setFillColor(...LIGHT);
    doc.rect(x, y, colW, 12, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 3, y + 5);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(m.value, x + 3, y + 10);
  });
  y += 22;

  // ─── Key points ──────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Points clés", margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  result.keyPoints.forEach((pt) => {
    doc.setTextColor(...GOLD);
    doc.text("▶", margin, y);
    doc.setTextColor(...NAVY);
    const lines = doc.splitTextToSize(pt, contentW - 8);
    doc.text(lines, margin + 6, y);
    y += lines.length * 5 + 2;
  });
  y += 4;

  // ─── Recommendations ─────────────────────────────────────────────
  if (result.recommendations.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("Recommandations", margin, y);
    y += 6;
    doc.setFontSize(9);
    result.recommendations.forEach((rec) => {
      doc.setTextColor(22, 163, 74);
      doc.text("✓", margin, y);
      doc.setTextColor(...NAVY);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(rec, contentW - 8);
      doc.text(lines, margin + 6, y);
      y += lines.length * 5 + 2;
    });
    y += 4;
  }

  // ─── Warnings ────────────────────────────────────────────────────
  if (result.warnings.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text("Points d'attention", margin, y);
    y += 6;
    doc.setFontSize(9);
    result.warnings.forEach((w) => {
      doc.setTextColor(220, 38, 38);
      doc.text("⚠", margin, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(w, contentW - 8);
      doc.text(lines, margin + 6, y);
      y += lines.length * 5 + 2;
    });
  }

  // ─── Footer ──────────────────────────────────────────────────────
  const footerY = 280;
  doc.setFillColor(...LIGHT);
  doc.rect(0, footerY, pageW, 17, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  const disclaimer = "Ce rapport est fourni à titre informatif uniquement et ne constitue pas un conseil fiscal ou juridique. JEVALIS recommande de consulter un expert-comptable ou un conseiller fiscal agréé pour toute décision d'investissement.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentW);
  doc.text(disclaimerLines, margin, footerY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("jevalis.com", pageW / 2, footerY + 14, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}
