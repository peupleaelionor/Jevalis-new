import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Wallet,
  PiggyBank,
  BarChart3,
  Clock,
  Percent,
  Info,
  Home,
  Euro,
} from "lucide-react";

interface FormData {
  purchasePrice: string;
  monthlyRent: string;
  monthlyCharges: string;
  loanAmount: string;
  loanRate: string;
  loanDuration: string;
  vacancyRate: string;
}

interface Results {
  grossYield: number;
  netYield: number;
  monthlyCashflow: number;
  annualCashflow: number;
  roi: number;
  breakEvenMonths: number;
}

const METRIC_EXPLANATIONS = [
  {
    title: "Rendement brut",
    icon: Percent,
    text: "Le rendement brut est le ratio entre les loyers annuels et le prix d'achat du bien. C'est un indicateur simple qui ne tient pas compte des charges, de la vacance ou du financement. Il permet une première comparaison rapide entre plusieurs biens.",
  },
  {
    title: "Rendement net",
    icon: TrendingUp,
    text: "Le rendement net intègre les charges mensuelles (copropriété, assurance, taxe foncière, gestion locative) et le taux de vacance locative. Il donne une image plus réaliste de la rentabilité réelle de votre investissement.",
  },
  {
    title: "Cashflow mensuel",
    icon: Wallet,
    text: "Le cashflow est la différence entre les revenus locatifs nets et la mensualité de remboursement du prêt. Un cashflow positif signifie que le bien s'autofinance et génère un surplus. Un cashflow négatif nécessite un effort d'épargne mensuel.",
  },
  {
    title: "ROI (Retour sur investissement)",
    icon: BarChart3,
    text: "Le ROI mesure le rendement annuel par rapport à votre apport personnel (prix d'achat – montant emprunté). Il tient compte de l'effet de levier du crédit et donne une vision claire de la performance de votre capital investi.",
  },
  {
    title: "Point mort (break-even)",
    icon: Clock,
    text: "Le point mort indique le nombre de mois nécessaires pour que les revenus locatifs cumulés couvrent votre apport personnel initial. Plus ce chiffre est bas, plus vite votre investissement commence à générer un profit réel.",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)} %`;
}

export default function RentalYieldPage() {
  const [formData, setFormData] = useState<FormData>({
    purchasePrice: "250000",
    monthlyRent: "1200",
    monthlyCharges: "250",
    loanAmount: "200000",
    loanRate: "3.5",
    loanDuration: "20",
    vacancyRate: "5",
  });

  useEffect(() => {
    document.title =
      "Simulateur de rendement locatif | Calcul rentabilité immobilière – JEVALIS";
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo<Results | null>(() => {
    const price = parseFloat(formData.purchasePrice);
    const rent = parseFloat(formData.monthlyRent);
    const charges = parseFloat(formData.monthlyCharges);
    const loan = parseFloat(formData.loanAmount);
    const rate = parseFloat(formData.loanRate) / 100;
    const duration = parseFloat(formData.loanDuration);
    const vacancy = parseFloat(formData.vacancyRate) / 100;

    if (!price || price <= 0 || !rent || rent <= 0 || !duration || duration <= 0) {
      return null;
    }

    const annualRentGross = rent * 12;
    const grossYield = (annualRentGross / price) * 100;

    const effectiveRent = rent * (1 - vacancy);
    const annualRentNet = (effectiveRent - charges) * 12;
    const netYield = (annualRentNet / price) * 100;

    let monthlyPayment = 0;
    if (loan > 0 && rate > 0) {
      const monthlyRate = rate / 12;
      const months = duration * 12;
      monthlyPayment =
        (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    } else if (loan > 0) {
      monthlyPayment = loan / (duration * 12);
    }

    const monthlyCashflow = effectiveRent - charges - monthlyPayment;
    const annualCashflow = monthlyCashflow * 12;

    const equity = Math.max(price - loan, 1);
    const roi = (annualCashflow / equity) * 100;

    let breakEvenMonths = 0;
    if (monthlyCashflow > 0) {
      breakEvenMonths = Math.ceil(equity / monthlyCashflow);
    }

    return {
      grossYield,
      netYield,
      monthlyCashflow,
      annualCashflow,
      roi,
      breakEvenMonths,
    };
  }, [formData]);

  const resultCards = results
    ? [
        {
          label: "Rendement brut",
          value: formatPercent(results.grossYield),
          icon: Percent,
          color: "gold-text",
        },
        {
          label: "Rendement net",
          value: formatPercent(results.netYield),
          icon: TrendingUp,
          color: results.netYield >= 0 ? "text-green-400" : "text-red-400",
        },
        {
          label: "Cashflow mensuel",
          value: formatCurrency(results.monthlyCashflow),
          icon: Wallet,
          color: results.monthlyCashflow >= 0 ? "text-green-400" : "text-red-400",
        },
        {
          label: "Cashflow annuel",
          value: formatCurrency(results.annualCashflow),
          icon: PiggyBank,
          color: results.annualCashflow >= 0 ? "text-green-400" : "text-red-400",
        },
        {
          label: "ROI",
          value: formatPercent(results.roi),
          icon: BarChart3,
          color: results.roi >= 0 ? "text-green-400" : "text-red-400",
        },
        {
          label: "Point mort",
          value:
            results.breakEvenMonths > 0
              ? `${results.breakEvenMonths} mois (~${Math.ceil(results.breakEvenMonths / 12)} ans)`
              : "N/A (cashflow négatif)",
          icon: Clock,
          color: results.breakEvenMonths > 0 ? "gold-text" : "text-red-400",
        },
      ]
    : [];

  return (
    <div className="min-h-screen" style={{ background: "#0B1628" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0B1628]/90 backdrop-blur-md border-b border-[oklch(0.15_0.02_250)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <span
              className="font-black text-lg tracking-widest"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-white">JE</span>
              <span className="gold-text">V</span>
              <span className="text-white">ALIS</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/comparateur/france-vs-suisse">
              <span className="text-[oklch(0.60_0.02_250)] hover:text-white text-sm transition-colors hidden sm:inline">
                Comparateur
              </span>
            </Link>
            <Link href="/">
              <Button className="gold-bg text-[#0B1628] font-bold px-5 py-2 rounded-none hover:opacity-90 text-sm">
                Simulation
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-[oklch(0.50_0.02_250)]">
          <Link href="/">
            <span className="hover:text-white transition-colors">Accueil</span>
          </Link>
          <span>/</span>
          <span className="gold-text">Rendement locatif</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-14">
        <div className="text-center max-w-3xl mx-auto">
          <Home className="w-10 h-10 gold-text mx-auto mb-4" />
          <h1
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Simulateur de{" "}
            <span className="gold-text">rendement locatif</span>
          </h1>
          <p className="text-[oklch(0.60_0.02_250)] text-lg">
            Calculez la rentabilité de votre investissement immobilier en quelques secondes :
            rendement brut, net, cashflow et retour sur investissement.
          </p>
          <div className="section-divider mx-auto mt-8" />
        </div>
      </section>

      {/* Calculator Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 gold-text" />
                  <span className="text-white" style={{ fontFamily: "var(--font-heading)" }}>
                    Paramètres
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Purchase Price */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Prix d'achat (€)
                  </Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => updateField("purchasePrice", e.target.value)}
                      placeholder="250 000"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>

                {/* Monthly Rent */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Loyer mensuel (€)
                  </Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => updateField("monthlyRent", e.target.value)}
                      placeholder="1 200"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>

                {/* Monthly Charges */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Charges mensuelles (€)
                  </Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      value={formData.monthlyCharges}
                      onChange={(e) => updateField("monthlyCharges", e.target.value)}
                      placeholder="250"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>

                <div className="h-px bg-[oklch(0.22_0.03_250)]" />

                {/* Loan Amount */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Montant emprunté (€)
                  </Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => updateField("loanAmount", e.target.value)}
                      placeholder="200 000"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>

                {/* Loan Rate */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Taux d'intérêt (%)
                  </Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.loanRate}
                      onChange={(e) => updateField("loanRate", e.target.value)}
                      placeholder="3.5"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>

                {/* Loan Duration */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Durée du prêt (années)
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      value={formData.loanDuration}
                      onChange={(e) => updateField("loanDuration", e.target.value)}
                      placeholder="20"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>

                {/* Vacancy Rate */}
                <div className="space-y-2">
                  <Label
                    className="text-[oklch(0.70_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Taux de vacance (%)
                  </Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.02_250)]" />
                    <Input
                      type="number"
                      step="1"
                      value={formData.vacancyRate}
                      onChange={(e) => updateField("vacancyRate", e.target.value)}
                      placeholder="5"
                      className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 pl-10 placeholder:text-[oklch(0.40_0.02_250)]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <h2
              className="text-xl font-black text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Résultats de votre simulation
            </h2>

            {results ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resultCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card
                      key={card.label}
                      className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)] hover-lift"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[oklch(0.18_0.03_250)] flex items-center justify-center">
                            <Icon className="w-4 h-4 gold-text" />
                          </div>
                          <span
                            className="text-[oklch(0.55_0.02_250)] text-xs uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-caption)" }}
                          >
                            {card.label}
                          </span>
                        </div>
                        <p
                          className={`text-xl md:text-2xl font-black ${card.color}`}
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {card.value}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)]">
                <CardContent className="p-8 text-center">
                  <Calculator className="w-10 h-10 text-[oklch(0.30_0.02_250)] mx-auto mb-4" />
                  <p className="text-[oklch(0.50_0.02_250)]">
                    Renseignez au minimum le prix d'achat, le loyer mensuel et la durée du prêt
                    pour obtenir vos résultats.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.30_0.08_85)]">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3
                    className="text-white font-bold mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Besoin d'une analyse complète ?
                  </h3>
                  <p className="text-[oklch(0.55_0.02_250)] text-sm">
                    Notre simulation JEVALIS intègre la fiscalité locale, les frais de notaire, les
                    taxes et produit un rapport PDF professionnel.
                  </p>
                </div>
                <Link href="/">
                  <Button className="gold-bg text-[#0B1628] font-bold rounded-none hover:opacity-90 whitespace-nowrap">
                    Simulation complète
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Metric Explanations */}
      <section className="section-gradient-accent py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Info className="w-6 h-6 gold-text" />
            <h2
              className="text-2xl font-black text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Comprendre les <span className="gold-text">indicateurs</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {METRIC_EXPLANATIONS.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={metric.title}
                  className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)]"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#0B1628]" />
                      </div>
                      <span className="text-white" style={{ fontFamily: "var(--font-heading)" }}>
                        {metric.title}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[oklch(0.60_0.02_250)] text-sm leading-relaxed">
                      {metric.text}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <Calculator className="w-10 h-10 gold-text mx-auto mb-4" />
        <h2
          className="text-2xl md:text-3xl font-black text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Allez plus loin avec <span className="gold-text">JEVALIS</span>
        </h2>
        <p className="text-[oklch(0.60_0.02_250)] mb-8 max-w-xl mx-auto">
          Ce simulateur donne une estimation rapide. Pour une analyse fiscale complète
          incluant les frais de notaire, droits de mutation et optimisations par pays,
          lancez une simulation JEVALIS.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gold-bg text-[#0B1628] font-black px-8 py-3 rounded-none hover:opacity-90 text-base">
              Lancer une simulation complète
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/comparateur/france-vs-suisse">
            <Button
              variant="outline"
              className="border-[oklch(0.30_0.03_250)] text-white rounded-none hover:bg-[oklch(0.18_0.03_250)] px-8 py-3 text-base"
            >
              Comparer deux pays
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.15_0.02_250)] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <span
              className="font-black text-sm tracking-widest"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-white">JE</span>
              <span className="gold-text">V</span>
              <span className="text-white">ALIS</span>
            </span>
          </Link>
          <p className="text-[oklch(0.40_0.02_250)] text-xs">
            © {new Date().getFullYear()} JEVALIS — Guide immobilier européen
          </p>
        </div>
      </footer>
    </div>
  );
}
