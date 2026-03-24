import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  Scale,
  FileText,
  Home,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  ArrowLeftRight,
  Calculator,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

interface CountryComparison {
  name: string;
  flag: string;
  slug: string;
  fraisNotaire: string;
  droitsMutation: string;
  taxeFonciere: string;
  plusValue: string;
  pointsForts: string[];
  pointsFaibles: string[];
}

const COUNTRIES: Record<string, CountryComparison> = {
  france: {
    name: "France",
    flag: "🇫🇷",
    slug: "france",
    fraisNotaire: "7-8 % (ancien) / 2-3 % (neuf)",
    droitsMutation: "5,80 % (DMTO)",
    taxeFonciere: "10-60 % de la valeur locative cadastrale",
    plusValue: "19 % + 17,2 % PS (exonération après 22-30 ans)",
    pointsForts: [
      "Large choix de biens et marchés variés",
      "Dispositifs fiscaux incitatifs (Pinel, LMNP, Denormandie)",
      "Exonération résidence principale sur la plus-value",
      "Frais réduits dans le neuf (2-3 %)",
    ],
    pointsFaibles: [
      "Frais de notaire élevés dans l'ancien (7-8 %)",
      "Prélèvements sociaux de 17,2 % sur les plus-values",
      "Taxe foncière en forte hausse dans certaines villes",
      "Encadrement des loyers dans les zones tendues",
    ],
  },
  suisse: {
    name: "Suisse",
    flag: "🇨🇭",
    slug: "suisse",
    fraisNotaire: "0,1-5 % selon le canton",
    droitsMutation: "0-3,3 % selon le canton",
    taxeFonciere: "0,1-0,3 % de la valeur fiscale",
    plusValue: "10-60 % (dégressif avec la durée de détention)",
    pointsForts: [
      "Impôt foncier très faible",
      "Certains cantons sans droits de mutation (Zurich)",
      "Forte demande locative et stabilité du marché",
      "Intérêts hypothécaires déductibles",
    ],
    pointsFaibles: [
      "Prix immobiliers très élevés",
      "Valeur locative imposée comme revenu",
      "Restrictions pour les non-résidents (Lex Koller)",
      "Plus-values lourdement taxées à court terme",
    ],
  },
  belgique: {
    name: "Belgique",
    flag: "🇧🇪",
    slug: "belgique",
    fraisNotaire: "11-15 % (droits + frais notariaux)",
    droitsMutation: "3 % (Flandre) / 12,5 % (Wallonie/Bruxelles)",
    taxeFonciere: "25-55 % du revenu cadastral",
    plusValue: "16,5 % (< 5 ans) / 0 % (> 5 ans)",
    pointsForts: [
      "Exonération totale des plus-values après 5 ans",
      "Taux réduit à 3 % en Flandre (résidence principale)",
      "Pas d'impôt sur le revenu locatif réel (forfaitaire via RC)",
      "Marché accessible avec des prix modérés",
    ],
    pointsFaibles: [
      "Droits d'enregistrement très élevés en Wallonie (12,5 %)",
      "Précompte immobilier élevé dans certaines communes",
      "Revenu cadastral basé sur des valeurs de 1975",
      "Complexité liée aux 3 régions fiscales",
    ],
  },
  luxembourg: {
    name: "Luxembourg",
    flag: "🇱🇺",
    slug: "luxembourg",
    fraisNotaire: "7-10 % (droits + frais notariaux)",
    droitsMutation: "7 % (6 % enregistrement + 1 % transcription)",
    taxeFonciere: "0,7-1 % de la valeur unitaire (très faible)",
    plusValue: "~10-12 % (> 2 ans) / barème progressif (< 2 ans)",
    pointsForts: [
      "Impôt foncier extrêmement faible",
      "Crédit d'impôt Bëllegen Akt (20 000 €/personne)",
      "Forte demande locative (croissance démographique)",
      "Abattement de 50 000 € sur les plus-values long terme",
    ],
    pointsFaibles: [
      "Prix immobiliers parmi les plus élevés d'Europe",
      "Droits d'enregistrement de 7 % (non négligeables)",
      "Offre limitée sur un marché très petit",
      "Rendements locatifs bruts modestes (3-4 %)",
    ],
  },
  "pays-bas": {
    name: "Pays-Bas",
    flag: "🇳🇱",
    slug: "pays-bas",
    fraisNotaire: "3-8 % (droits + frais notariaux)",
    droitsMutation: "2 % (rés. principale) / 10,4 % (investissement)",
    taxeFonciere: "0,04-0,2 % de la WOZ-waarde",
    plusValue: "Pas de taxe directe (imposition forfaitaire Box 3)",
    pointsForts: [
      "Exonération pour les primo-accédants < 35 ans",
      "Pas de taxe directe sur les plus-values (particuliers)",
      "Intérêts hypothécaires déductibles (résidence principale)",
      "WOZ-waarde réévaluée annuellement (transparence)",
    ],
    pointsFaibles: [
      "Droits de mutation très élevés pour les investissements (10,4 %)",
      "Imposition Box 3 sur le patrimoine immobilier locatif",
      "Marché très compétitif avec forte demande",
      "Réglementation locative stricte",
    ],
  },
  allemagne: {
    name: "Allemagne",
    flag: "🇩🇪",
    slug: "allemagne",
    fraisNotaire: "7-15 % (Grunderwerbsteuer + notaire + agent)",
    droitsMutation: "3,5-6,5 % selon le Land",
    taxeFonciere: "Réformée 2025 : variable selon commune/Land",
    plusValue: "Barème progressif (< 10 ans) / 0 % (> 10 ans)",
    pointsForts: [
      "Exonération totale des plus-values après 10 ans",
      "Amortissement du bâtiment déductible (2-3 %/an)",
      "Intérêts d'emprunt déductibles (locatif)",
      "Marché stable et profond dans les grandes villes",
    ],
    pointsFaibles: [
      "Frais d'acquisition parmi les plus élevés (jusqu'à 15 %)",
      "Grunderwerbsteuer non récupérable",
      "Commission d'agent immobilier élevée",
      "Réforme Grundsteuer créant de l'incertitude",
    ],
  },
};

const COMPARISON_PAIRS = [
  { slug: "france-vs-suisse", left: "france", right: "suisse" },
  { slug: "france-vs-belgique", left: "france", right: "belgique" },
  { slug: "france-vs-luxembourg", left: "france", right: "luxembourg" },
  { slug: "france-vs-allemagne", left: "france", right: "allemagne" },
  { slug: "france-vs-pays-bas", left: "france", right: "pays-bas" },
];

const COMPARISON_ROWS = [
  { key: "fraisNotaire" as const, label: "Frais de notaire", icon: FileText },
  { key: "droitsMutation" as const, label: "Droits de mutation", icon: Scale },
  { key: "taxeFonciere" as const, label: "Taxe foncière", icon: Home },
  { key: "plusValue" as const, label: "Fiscalité plus-value", icon: TrendingUp },
];

function getRecommendation(leftSlug: string, rightSlug: string): string {
  const recommendations: Record<string, string> = {
    "france-suisse":
      "La Suisse offre une fiscalité foncière nettement plus faible et des frais d'acquisition potentiellement réduits, mais les prix d'entrée sont bien plus élevés. La France reste plus accessible et propose davantage de dispositifs d'incitation fiscale (Pinel, LMNP). Pour un investisseur à budget modéré, la France est souvent plus adaptée. Pour un patrimoine conséquent avec objectif de stabilité, la Suisse est un choix de premier plan.",
    "france-belgique":
      "La Belgique se distingue par l'exonération des plus-values après 5 ans (vs 22-30 ans en France) et un taux réduit à 3 % en Flandre. Cependant, les droits d'enregistrement en Wallonie (12,5 %) sont parmi les plus élevés d'Europe. La France offre davantage de dispositifs d'optimisation fiscale et un marché plus diversifié. Le choix dépend fortement de la région belge visée.",
    "france-luxembourg":
      "Le Luxembourg séduit par son impôt foncier quasi symbolique et le crédit d'impôt Bëllegen Akt, mais les prix y sont exceptionnellement élevés. La France propose un marché plus vaste et des dispositifs fiscaux variés. Pour un investisseur frontalier, le Luxembourg offre une combinaison intéressante de rendement locatif et de stabilité. La France reste préférable pour la diversification géographique.",
    "france-allemagne":
      "L'Allemagne offre une exonération des plus-values après 10 ans et un amortissement déductible attractif pour le locatif, mais les frais d'acquisition sont les plus élevés d'Europe. La France propose des frais plus prévisibles et davantage de dispositifs de réduction d'impôt. L'Allemagne est à privilégier pour l'investissement locatif long terme dans les grandes métropoles.",
    "france-pays-bas":
      "Les Pays-Bas se distinguent par l'absence de taxation directe des plus-values et des avantages pour les primo-accédants, mais le taux de 10,4 % pour l'investissement est dissuasif. La France offre un cadre plus complet et des dispositifs d'optimisation variés. Les Pays-Bas sont un bon choix pour une résidence principale ; la France est plus avantageuse pour l'investissement locatif.",
  };
  return (
    recommendations[`${leftSlug}-${rightSlug}`] ||
    recommendations[`${rightSlug}-${leftSlug}`] ||
    "Chaque pays présente des avantages spécifiques selon votre situation. Utilisez notre simulateur pour obtenir une analyse personnalisée."
  );
}

export default function ComparatorPage() {
  const params = useParams<{ pair: string }>();
  const [, navigate] = useLocation();

  const initialPair = COMPARISON_PAIRS.find((p) => p.slug === params.pair) ?? COMPARISON_PAIRS[0];
  const [leftSlug, setLeftSlug] = useState(initialPair.left);
  const [rightSlug, setRightSlug] = useState(initialPair.right);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const left = COUNTRIES[leftSlug];
  const right = COUNTRIES[rightSlug];

  useEffect(() => {
    const pair = COMPARISON_PAIRS.find(
      (p) => p.left === leftSlug && p.right === rightSlug,
    );
    if (pair) {
      navigate(`/comparateur/${pair.slug}`, { replace: true });
    }
    document.title = `Comparaison ${left.name} vs ${right.name} | Fiscalité immobilière – JEVALIS`;
  }, [leftSlug, rightSlug, left.name, right.name, navigate]);

  const selectPair = (pairSlug: string) => {
    const pair = COMPARISON_PAIRS.find((p) => p.slug === pairSlug);
    if (pair) {
      setLeftSlug(pair.left);
      setRightSlug(pair.right);
    }
    setDropdownOpen(false);
  };

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
            <Link href="/rendement-locatif">
              <span className="text-[oklch(0.60_0.02_250)] hover:text-white text-sm transition-colors hidden sm:inline">
                Rendement
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
          <span className="gold-text">Comparateur</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-14">
        <div className="text-center max-w-3xl mx-auto">
          <ArrowLeftRight className="w-10 h-10 gold-text mx-auto mb-4" />
          <h1
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {left.flag} {left.name}{" "}
            <span className="gold-text">vs</span>{" "}
            {right.flag} {right.name}
          </h1>
          <p className="text-[oklch(0.60_0.02_250)] text-lg">
            Comparez la fiscalité immobilière des deux pays pour faire le meilleur choix
            d'investissement.
          </p>
          <div className="section-divider mx-auto mt-8" />
        </div>
      </section>

      {/* Pair Selector */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap justify-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[oklch(0.25_0.03_250)] bg-[oklch(0.14_0.03_250)] text-white text-sm rounded-none hover:border-[oklch(0.75_0.12_85)] transition-colors"
              style={{ fontFamily: "var(--font-caption)" }}
            >
              Changer la comparaison
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[oklch(0.14_0.03_250)] border border-[oklch(0.25_0.03_250)] z-20 shadow-xl">
                {COMPARISON_PAIRS.map((pair) => {
                  const l = COUNTRIES[pair.left];
                  const r = COUNTRIES[pair.right];
                  const isActive = pair.left === leftSlug && pair.right === rightSlug;
                  return (
                    <button
                      key={pair.slug}
                      onClick={() => selectPair(pair.slug)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "gold-bg text-[#0B1628] font-bold"
                          : "text-white hover:bg-[oklch(0.18_0.03_250)]"
                      }`}
                    >
                      {l.flag} {l.name} vs {r.flag} {r.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center justify-center">
            <span className="text-[oklch(0.50_0.02_250)] text-sm uppercase tracking-widest" style={{ fontFamily: "var(--font-caption)" }}>
              Critère
            </span>
          </div>
          <div className="text-center">
            <span className="text-3xl block mb-1">{left.flag}</span>
            <span className="text-white font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {left.name}
            </span>
          </div>
          <div className="text-center">
            <span className="text-3xl block mb-1">{right.flag}</span>
            <span className="text-white font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {right.name}
            </span>
          </div>
        </div>

        {/* Data Rows */}
        <div className="space-y-3">
          {COMPARISON_ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.key}
                className="grid grid-cols-3 gap-4 bg-[oklch(0.14_0.03_250)] border border-[oklch(0.22_0.03_250)] p-4 md:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#0B1628]" />
                  </div>
                  <span
                    className="text-white text-sm font-semibold hidden sm:inline"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-white text-xs font-semibold sm:hidden"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {row.label}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="text-[oklch(0.70_0.02_250)] text-xs md:text-sm">
                    {left[row.key]}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-[oklch(0.70_0.02_250)] text-xs md:text-sm">
                    {right[row.key]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Points Forts / Faibles */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {[left, right].map((country) => (
            <div key={country.slug} className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{country.flag}</span>
                <h3
                  className="text-xl font-black text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {country.name}
                </h3>
              </div>

              {/* Points Forts */}
              <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400 text-base">
                    <ThumbsUp className="w-4 h-4" />
                    <span style={{ fontFamily: "var(--font-heading)" }}>Points forts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {country.pointsForts.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[oklch(0.65_0.02_250)]">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Points Faibles */}
              <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400 text-base">
                    <ThumbsDown className="w-4 h-4" />
                    <span style={{ fontFamily: "var(--font-heading)" }}>Points faibles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {country.pointsFaibles.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[oklch(0.65_0.02_250)]">
                        <span className="text-red-400 mt-0.5">✗</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* CTA */}
              <Link href="/">
                <Button className="w-full gold-bg text-[#0B1628] font-bold rounded-none hover:opacity-90">
                  Simuler en {country.name} {country.flag}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendation */}
      <section className="section-gradient-accent py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <Lightbulb className="w-10 h-10 gold-text mx-auto mb-4" />
            <h2
              className="text-2xl md:text-3xl font-black text-white mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Notre <span className="gold-text">recommandation</span>
            </h2>
          </div>
          <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.30_0.08_85)]">
            <CardContent className="p-6 md:p-8">
              <p className="text-[oklch(0.70_0.02_250)] leading-relaxed text-sm md:text-base">
                {getRecommendation(leftSlug, rightSlug)}
              </p>
            </CardContent>
          </Card>
          <div className="text-center mt-8">
            <Link href="/">
              <Button className="gold-bg text-[#0B1628] font-black px-8 py-3 rounded-none hover:opacity-90 text-base">
                <Calculator className="w-4 h-4" />
                Obtenir une simulation personnalisée
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Country Guide Links */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2
          className="text-xl font-black text-white mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Guides fiscaux détaillés
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[left, right].map((country) => (
            <Link key={country.slug} href={`/fiscalite/${country.slug}`}>
              <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)] hover-lift cursor-pointer">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <p className="text-white font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                        Guide fiscal – {country.name}
                      </p>
                      <p className="text-[oklch(0.50_0.02_250)] text-xs">
                        Frais, taxes, plus-values et FAQ
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[oklch(0.50_0.02_250)]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Other Comparisons */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h3
          className="text-lg font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Autres comparaisons
        </h3>
        <div className="flex flex-wrap gap-3">
          {COMPARISON_PAIRS.filter(
            (p) => !(p.left === leftSlug && p.right === rightSlug),
          ).map((pair) => {
            const l = COUNTRIES[pair.left];
            const r = COUNTRIES[pair.right];
            return (
              <Link key={pair.slug} href={`/comparateur/${pair.slug}`}>
                <span className="inline-block px-4 py-2 border border-[oklch(0.22_0.03_250)] text-[oklch(0.60_0.02_250)] text-sm hover:border-[oklch(0.75_0.12_85)] hover:text-white transition-colors">
                  {l.flag} {l.name} vs {r.flag} {r.name}
                </span>
              </Link>
            );
          })}
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
