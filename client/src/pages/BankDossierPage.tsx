import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  ArrowLeft,
  Shield,
  CheckCircle,
  Building2,
  User,
  Euro,
  TrendingUp,
  Calculator,
  Landmark,
  Download,
  Lock,
  BadgeCheck,
  ChevronRight,
  Briefcase,
  Home,
  PiggyBank,
} from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  propertyType: string;
  purchasePrice: string;
  city: string;
  country: string;
  downPayment: string;
  loanAmount: string;
  loanDuration: string;
  monthlyIncome: string;
  existingDebts: string;
}

const COUNTRIES = [
  { value: "france", label: "France", flag: "🇫🇷" },
  { value: "suisse", label: "Suisse", flag: "🇨🇭" },
  { value: "belgique", label: "Belgique", flag: "🇧🇪" },
  { value: "luxembourg", label: "Luxembourg", flag: "🇱🇺" },
  { value: "espagne", label: "Espagne", flag: "🇪🇸" },
  { value: "portugal", label: "Portugal", flag: "🇵🇹" },
];

const PROPERTY_TYPES = [
  { value: "residence_principale", label: "Résidence principale", icon: Home },
  { value: "investissement_locatif", label: "Investissement locatif", icon: TrendingUp },
  { value: "residence_secondaire", label: "Résidence secondaire", icon: Building2 },
];

const DOSSIER_SECTIONS = [
  { icon: User, title: "Informations personnelles", description: "Identité, situation professionnelle et coordonnées complètes" },
  { icon: Building2, title: "Détails du bien", description: "Caractéristiques du bien, localisation et type d'opération" },
  { icon: Euro, title: "Plan de financement", description: "Apport personnel, montant emprunté et tableau de financement" },
  { icon: Calculator, title: "Simulation de prêt", description: "Mensualités, taux estimé et tableau d'amortissement simplifié" },
  { icon: Landmark, title: "Frais d'acquisition", description: "Frais de notaire, taxes, frais de garantie et de dossier" },
  { icon: TrendingUp, title: "Projection fiscale", description: "Estimation des avantages fiscaux et impact sur votre imposition" },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Données chiffrées SSL" },
  { icon: Lock, label: "Conforme RGPD" },
  { icon: BadgeCheck, label: "Format bancaire officiel" },
  { icon: FileText, label: "PDF haute qualité" },
];

function formatCurrency(value: string): string {
  const num = parseInt(value.replace(/\s/g, ""), 10);
  if (isNaN(num)) return "—";
  return num.toLocaleString("fr-FR") + " €";
}

export default function BankDossierPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    propertyType: "",
    purchasePrice: "",
    city: "",
    country: "",
    downPayment: "",
    loanAmount: "",
    loanDuration: "20",
    monthlyIncome: "",
    existingDebts: "0",
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    formData.fullName &&
    formData.email &&
    formData.propertyType &&
    formData.purchasePrice &&
    formData.city &&
    formData.country &&
    formData.downPayment &&
    formData.loanAmount &&
    formData.loanDuration &&
    formData.monthlyIncome;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) setShowPreview(true);
  };

  const selectedCountry = COUNTRIES.find((c) => c.value === formData.country);
  const selectedPropertyType = PROPERTY_TYPES.find((p) => p.value === formData.propertyType);

  const debtRatio =
    formData.monthlyIncome && formData.loanAmount && formData.loanDuration
      ? (() => {
          const principal = parseInt(formData.loanAmount.replace(/\s/g, ""), 10);
          const months = parseInt(formData.loanDuration, 10) * 12;
          const rate = 0.035 / 12;
          const monthly = (principal * rate) / (1 - Math.pow(1 + rate, -months));
          const debts = parseInt((formData.existingDebts || "0").replace(/\s/g, ""), 10) || 0;
          const income = parseInt(formData.monthlyIncome.replace(/\s/g, ""), 10);
          return income > 0 ? (((monthly + debts) / income) * 100).toFixed(1) : "—";
        })()
      : "—";

  return (
    <div className="min-h-screen" style={{ background: "#0B1628" }}>
      {/* Navigation */}
      <nav className="border-b border-[oklch(0.20_0.03_250)] bg-[#0B1628]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <span
              className="font-black text-xl tracking-widest cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-white">JE</span>
              <span className="gold-text">V</span>
              <span className="text-white">ALIS</span>
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-2 text-[oklch(0.55_0.02_250)] hover:text-white transition-colors text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[oklch(0.15_0.03_250)]">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, oklch(0.75 0.12 85), transparent 70%)" }}
          />
        </div>
        <div className="container py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-bg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0B1628]" />
              </div>
              <span
                className="text-[oklch(0.55_0.02_250)] text-sm uppercase tracking-widest"
                style={{ fontFamily: "var(--font-caption)" }}
              >
                Service Premium
              </span>
            </div>
            <h1
              className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Votre <span className="gold-text italic">Dossier Bancaire</span>
              <br />
              prêt pour le financement
            </h1>
            <p
              className="text-lg text-[oklch(0.55_0.02_250)] leading-relaxed mb-8 max-w-2xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Générez un dossier PDF professionnel et complet, prêt à être présenté
              à votre banque ou courtier. Toutes les données essentielles pour
              accélérer votre demande de prêt immobilier.
            </p>
            <div className="flex flex-wrap gap-6">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[oklch(0.50_0.02_250)] text-sm"
                  style={{ fontFamily: "var(--font-caption)" }}
                >
                  <Icon className="w-4 h-4 gold-text" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What the Dossier Includes */}
      <section className="container py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2
            className="text-2xl lg:text-3xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contenu du <span className="gold-text">dossier</span>
          </h2>
          <p
            className="text-[oklch(0.50_0.02_250)] max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Un document structuré couvrant tous les éléments attendus par les
            établissements bancaires.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOSSIER_SECTIONS.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="bg-[oklch(0.13_0.025_250)] border-[oklch(0.20_0.03_250)] hover:border-[oklch(0.30_0.03_250)] transition-colors"
            >
              <CardContent className="p-6">
                <div className="w-10 h-10 border border-[oklch(0.25_0.03_250)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 gold-text" />
                </div>
                <h3
                  className="text-base font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm text-[oklch(0.50_0.02_250)] leading-relaxed"
                  style={{ fontFamily: "var(--font-caption)" }}
                >
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="container py-16 lg:py-20 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl lg:text-3xl font-black text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Préparez votre <span className="gold-text">dossier</span>
            </h2>
            <p
              className="text-[oklch(0.50_0.02_250)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Remplissez les informations ci-dessous pour générer votre dossier
              bancaire personnalisé.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Information */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 gold-bg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#0B1628]" />
                </div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Informations personnelles
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="jean@exemple.com"
                    required
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Revenu mensuel net (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => updateField("monthlyIncome", e.target.value)}
                    placeholder="4 500"
                    required
                    min="0"
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Dettes existantes (€/mois)
                  </label>
                  <input
                    type="number"
                    value={formData.existingDebts}
                    onChange={(e) => updateField("existingDebts", e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 gold-bg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#0B1628]" />
                </div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Détails du bien
                </h3>
              </div>

              <div className="space-y-2">
                <label
                  className="text-[oklch(0.65_0.02_250)] text-sm"
                  style={{ fontFamily: "var(--font-caption)" }}
                >
                  Type d'opération *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PROPERTY_TYPES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateField("propertyType", value)}
                      className={`flex items-center gap-3 p-4 border transition-all text-left rounded-md ${
                        formData.propertyType === value
                          ? "border-[oklch(0.65_0.12_85)] bg-[oklch(0.16_0.03_250)]"
                          : "border-[oklch(0.22_0.03_250)] bg-[oklch(0.13_0.025_250)] hover:border-[oklch(0.30_0.03_250)]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          formData.propertyType === value
                            ? "gold-text"
                            : "text-[oklch(0.45_0.02_250)]"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          formData.propertyType === value
                            ? "text-white"
                            : "text-[oklch(0.55_0.02_250)]"
                        }`}
                        style={{ fontFamily: "var(--font-caption)" }}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Prix d'achat (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => updateField("purchasePrice", e.target.value)}
                    placeholder="350 000"
                    required
                    min="0"
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Paris"
                    required
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-[oklch(0.65_0.02_250)] text-sm"
                  style={{ fontFamily: "var(--font-caption)" }}
                >
                  Pays *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COUNTRIES.map(({ value, label, flag }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateField("country", value)}
                      className={`flex items-center gap-2 p-3 border transition-all rounded-md ${
                        formData.country === value
                          ? "border-[oklch(0.65_0.12_85)] bg-[oklch(0.16_0.03_250)]"
                          : "border-[oklch(0.22_0.03_250)] bg-[oklch(0.13_0.025_250)] hover:border-[oklch(0.30_0.03_250)]"
                      }`}
                    >
                      <span className="text-lg">{flag}</span>
                      <span
                        className={`text-sm ${
                          formData.country === value
                            ? "text-white font-medium"
                            : "text-[oklch(0.55_0.02_250)]"
                        }`}
                        style={{ fontFamily: "var(--font-caption)" }}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Plan */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 gold-bg flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-[#0B1628]" />
                </div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Plan de financement
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Apport personnel (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) => updateField("downPayment", e.target.value)}
                    placeholder="70 000"
                    required
                    min="0"
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Montant du prêt (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => updateField("loanAmount", e.target.value)}
                    placeholder="280 000"
                    required
                    min="0"
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-[oklch(0.65_0.02_250)] text-sm"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Durée du prêt (années) *
                  </label>
                  <select
                    value={formData.loanDuration}
                    onChange={(e) => updateField("loanDuration", e.target.value)}
                    required
                    className="w-full bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] text-white h-12 px-4 focus:border-[oklch(0.65_0.12_85)] focus:outline-none transition-colors rounded-md text-sm appearance-none cursor-pointer"
                  >
                    {[5, 7, 10, 12, 15, 20, 25, 30].map((y) => (
                      <option key={y} value={y}>
                        {y} ans
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-14 gold-bg text-[#0B1628] font-black text-base hover:opacity-90 gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <FileText className="w-5 h-5" />
                Générer l'aperçu du dossier
                <ChevronRight className="w-5 h-5" />
              </Button>
              <p
                className="text-center text-xs text-[oklch(0.40_0.02_250)] mt-3"
                style={{ fontFamily: "var(--font-caption)" }}
              >
                Aperçu gratuit — le PDF complet est disponible après paiement.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Preview Section */}
      {showPreview && (
        <section className="container py-16 lg:py-20 border-t border-[oklch(0.15_0.03_250)]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 gold-bg text-[#0B1628] px-4 py-2 text-sm font-bold mb-4 rounded-md">
                <CheckCircle className="w-4 h-4" />
                Aperçu généré
              </div>
              <h2
                className="text-2xl lg:text-3xl font-black text-white mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Votre dossier <span className="gold-text">en aperçu</span>
              </h2>
              <p
                className="text-[oklch(0.50_0.02_250)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Voici un résumé de votre dossier bancaire. Le PDF complet
                inclura des tableaux détaillés et des projections chiffrées.
              </p>
            </div>

            {/* Mock Dossier Preview */}
            <Card className="bg-white border-none overflow-hidden">
              <CardContent className="p-0">
                {/* Header */}
                <div
                  className="p-8 text-center"
                  style={{ background: "#0B1628" }}
                >
                  <span
                    className="font-black text-2xl tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-white">JE</span>
                    <span className="gold-text">V</span>
                    <span className="text-white">ALIS</span>
                  </span>
                  <p
                    className="text-[oklch(0.55_0.02_250)] text-sm mt-2"
                    style={{ fontFamily: "var(--font-caption)" }}
                  >
                    Dossier Bancaire — Document confidentiel
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Emprunteur */}
                  <div>
                    <h3
                      className="text-sm font-bold text-[#0B1628] uppercase tracking-wider mb-4 pb-2 border-b-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        borderColor: "#C9A84C",
                      }}
                    >
                      <User className="w-4 h-4 inline mr-2" style={{ color: "#C9A84C" }} />
                      Emprunteur
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Nom</span>
                        <p className="font-semibold text-[#0B1628]">
                          {formData.fullName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email</span>
                        <p className="font-semibold text-[#0B1628]">
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Revenu mensuel net</span>
                        <p className="font-semibold text-[#0B1628]">
                          {formatCurrency(formData.monthlyIncome)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Charges existantes</span>
                        <p className="font-semibold text-[#0B1628]">
                          {formatCurrency(formData.existingDebts || "0")}
                          /mois
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bien immobilier */}
                  <div>
                    <h3
                      className="text-sm font-bold text-[#0B1628] uppercase tracking-wider mb-4 pb-2 border-b-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        borderColor: "#C9A84C",
                      }}
                    >
                      <Building2 className="w-4 h-4 inline mr-2" style={{ color: "#C9A84C" }} />
                      Bien immobilier
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type</span>
                        <p className="font-semibold text-[#0B1628]">
                          {selectedPropertyType?.label ?? "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prix d'achat</span>
                        <p className="font-semibold text-[#0B1628]">
                          {formatCurrency(formData.purchasePrice)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Localisation</span>
                        <p className="font-semibold text-[#0B1628]">
                          {formData.city},{" "}
                          {selectedCountry
                            ? `${selectedCountry.flag} ${selectedCountry.label}`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Plan de financement */}
                  <div>
                    <h3
                      className="text-sm font-bold text-[#0B1628] uppercase tracking-wider mb-4 pb-2 border-b-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        borderColor: "#C9A84C",
                      }}
                    >
                      <Briefcase className="w-4 h-4 inline mr-2" style={{ color: "#C9A84C" }} />
                      Plan de financement
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <span className="text-gray-500 text-xs block mb-1">
                          Apport personnel
                        </span>
                        <p className="font-bold text-[#0B1628] text-lg">
                          {formatCurrency(formData.downPayment)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <span className="text-gray-500 text-xs block mb-1">
                          Montant emprunté
                        </span>
                        <p className="font-bold text-lg" style={{ color: "#C9A84C" }}>
                          {formatCurrency(formData.loanAmount)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <span className="text-gray-500 text-xs block mb-1">
                          Durée
                        </span>
                        <p className="font-bold text-[#0B1628] text-lg">
                          {formData.loanDuration} ans
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Indicateurs clés */}
                  <div>
                    <h3
                      className="text-sm font-bold text-[#0B1628] uppercase tracking-wider mb-4 pb-2 border-b-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        borderColor: "#C9A84C",
                      }}
                    >
                      <TrendingUp className="w-4 h-4 inline mr-2" style={{ color: "#C9A84C" }} />
                      Indicateurs clés
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">
                          Taux d'endettement estimé
                        </span>
                        <p
                          className={`font-bold text-lg ${
                            typeof debtRatio === "string" && parseFloat(debtRatio) > 35
                              ? "text-red-600"
                              : "text-green-700"
                          }`}
                        >
                          {debtRatio}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Taux indicatif appliqué
                        </span>
                        <p className="font-bold text-[#0B1628] text-lg">
                          3,50 %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Watermark */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 italic">
                      Aperçu simplifié — Le PDF complet inclut le tableau
                      d'amortissement, les frais d'acquisition détaillés et la
                      projection fiscale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA – Generate Full PDF */}
            <div className="mt-10 text-center space-y-4">
              <Link href="/simulation">
                <Button
                  className="h-14 px-10 gold-bg text-[#0B1628] font-black text-base hover:opacity-90 gap-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Download className="w-5 h-5" />
                  Obtenir le PDF complet
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <p
                className="text-[oklch(0.45_0.02_250)] text-sm"
                style={{ fontFamily: "var(--font-caption)" }}
              >
                Paiement sécurisé — Livraison instantanée par email
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Guarantees */}
      <section className="border-t border-[oklch(0.15_0.03_250)]">
        <div className="container py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2
              className="text-2xl font-black text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Pourquoi <span className="gold-text">nous faire confiance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Sécurité maximale",
                text: "Vos données sont chiffrées et ne sont jamais partagées avec des tiers.",
              },
              {
                icon: BadgeCheck,
                title: "Format professionnel",
                text: "Un dossier structuré selon les standards attendus par les banques européennes.",
              },
              {
                icon: Landmark,
                title: "6 pays couverts",
                text: "France, Suisse, Belgique, Luxembourg, Espagne et Portugal.",
              },
              {
                icon: FileText,
                title: "PDF immédiat",
                text: "Recevez votre dossier bancaire complet en quelques minutes après paiement.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 border border-[oklch(0.25_0.03_250)] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 gold-text" />
                </div>
                <h3
                  className="text-sm font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-xs text-[oklch(0.50_0.02_250)] leading-relaxed"
                  style={{ fontFamily: "var(--font-caption)" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.15_0.03_250)] py-8">
        <div className="container text-center">
          <p
            className="text-xs text-[oklch(0.35_0.02_250)]"
            style={{ fontFamily: "var(--font-caption)" }}
          >
            © 2026 Jevalis. Tous droits réservés. Ce document ne constitue pas
            un engagement de financement.
          </p>
        </div>
      </footer>
    </div>
  );
}
