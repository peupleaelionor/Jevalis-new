import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  MapPin,
  ArrowRight,
  ChevronDown,
  Calculator,
  Scale,
  Landmark,
  Lightbulb,
  Euro,
  Building2,
  FileText,
  Globe,
  Shield,
} from "lucide-react";

interface CountryData {
  id: string;
  name: string;
  flag: string;
  fraisNotaire: string;
  droitsMutation: string;
  fiscalite: string[];
  tips: string[];
  highlight: string;
}

const countries: CountryData[] = [
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    fraisNotaire:
      "Les frais de notaire en France s'élèvent à environ 7–8 % du prix de vente dans l'ancien et 2–3 % dans le neuf. Ils comprennent les droits de mutation, les émoluments du notaire et les débours.",
    droitsMutation:
      "Les droits de mutation à titre onéreux (DMTO) représentent environ 5,80 % du prix d'achat (dont 4,50 % de taxe départementale et 1,20 % de taxe communale). Certains départements appliquent un taux majoré de 4,50 % depuis 2014.",
    fiscalite: [
      "Impôt sur la fortune immobilière (IFI) : seuil de 1,3 M€ net",
      "Plus-values immobilières : 19 % + 17,2 % de prélèvements sociaux, avec abattements progressifs",
      "Taxe foncière variable selon la commune (600–3 000 €/an en moyenne)",
      "Revenus fonciers imposés au barème progressif de l'IR (0–45 %)",
    ],
    tips: [
      "Le dispositif Pinel permet une réduction d'impôt jusqu'à 14 % pour un investissement locatif neuf en 2025",
      "L'exonération de plus-value sur la résidence principale reste totale et sans condition de durée",
      "Le PTZ (Prêt à Taux Zéro) est recentré sur les zones tendues en 2025",
    ],
    highlight: "Marché le plus liquide d'Europe continentale",
  },
  {
    id: "suisse",
    name: "Suisse",
    flag: "🇨🇭",
    fraisNotaire:
      "Les frais de notaire en Suisse varient fortement selon les cantons, de 0,1 % à 0,5 % du prix de vente. La Suisse a l'un des taux les plus bas d'Europe pour les émoluments notariaux.",
    droitsMutation:
      "Les droits de mutation sont cantonaux : de 0 % (Zurich, Schwytz) à 3,3 % (Genève). Le canton de Vaud applique 3,3 %, Berne 1,8 %. Certains cantons n'imposent aucun droit de mutation.",
    fiscalite: [
      "Impôt sur la valeur locative : les propriétaires sont imposés sur un revenu fictif de leur bien",
      "Impôt sur les gains immobiliers (cantonal) : 10–40 % dégressif selon la durée de détention",
      "Impôt sur la fortune : le bien immobilier est inclus dans l'assiette patrimoniale",
      "Pas d'impôt sur les plus-values après 20–25 ans de détention dans certains cantons",
    ],
    tips: [
      "La Lex Koller restreint l'acquisition de biens immobiliers par les non-résidents étrangers",
      "Les taux hypothécaires suisses restent parmi les plus bas d'Europe (~1,5–2,5 % en 2025)",
      "L'amortissement indirect via le pilier 3a permet des déductions fiscales intéressantes",
    ],
    highlight: "Stabilité exceptionnelle et rendements locatifs nets de 3–4 %",
  },
  {
    id: "belgique",
    name: "Belgique",
    flag: "🇧🇪",
    fraisNotaire:
      "Les frais de notaire en Belgique sont réglementés et s'élèvent à environ 10–15 % du prix d'achat, incluant les droits d'enregistrement, les honoraires du notaire et les frais administratifs.",
    droitsMutation:
      "Les droits d'enregistrement varient par région : 12,5 % en Wallonie et à Bruxelles, 3 % en Flandre (réduit à 1 % pour l'unique habitation ≤ 220 000 €). Un abattement de 175 000 € s'applique à Bruxelles pour la première acquisition.",
    fiscalite: [
      "Précompte immobilier annuel : base cadastrale × taux communal (1 000–3 500 €/an)",
      "Plus-values immobilières : exonération après 5 ans pour les biens bâtis, 8 ans pour les terrains",
      "Revenus locatifs imposés sur base du revenu cadastral indexé × 1,4 (pas sur les loyers réels)",
      "Pas d'impôt sur la fortune en Belgique",
    ],
    tips: [
      "La Flandre offre les droits d'enregistrement les plus compétitifs (3 %) d'Europe occidentale",
      "Le woonbonus flamand a été supprimé, mais des avantages fiscaux régionaux subsistent",
      "Bruxelles offre un abattement significatif pour les primo-accédants",
    ],
    highlight: "Fiscalité avantageuse sur les revenus locatifs (base cadastrale)",
  },
  {
    id: "luxembourg",
    name: "Luxembourg",
    flag: "🇱🇺",
    fraisNotaire:
      "Les frais de notaire au Luxembourg représentent environ 7–10 % du prix d'achat. Les droits d'enregistrement sont de 6 % (droits de transcription) auxquels s'ajoutent 1 % de droits d'inscription hypothécaire.",
    droitsMutation:
      "Les droits de transcription s'élèvent à 6 % du prix de vente, plus 1 % de droit d'inscription hypothécaire. Un crédit d'impôt (Bëllegen Akt) de 20 000 € par acquéreur est accordé pour l'acquisition d'une résidence principale.",
    fiscalite: [
      "Impôt foncier (Grundsteuer) : très modéré, souvent < 200 €/an",
      "Plus-values immobilières : imposées au demi-taux global après 2 ans de détention",
      "Amortissement accéléré de 6 % les 6 premières années pour l'investissement locatif",
      "Revenus locatifs imposés au barème progressif (0–42 %)",
    ],
    tips: [
      "Le Bëllegen Akt offre un crédit d'impôt de 40 000 € pour un couple acquérant sa résidence principale",
      "Les prix au m² restent parmi les plus élevés d'Europe (~10 000–13 000 €/m² à Luxembourg-Ville)",
      "L'amortissement accéléré de 6 % rend l'investissement locatif très attractif fiscalement",
    ],
    highlight: "Amortissement accéléré unique en Europe et forte demande locative",
  },
  {
    id: "pays-bas",
    name: "Pays-Bas",
    flag: "🇳🇱",
    fraisNotaire:
      "Les frais de notaire aux Pays-Bas sont relativement bas : environ 1–2 % du prix d'achat. Les droits de mutation (overdrachtsbelasting) constituent le poste principal.",
    droitsMutation:
      "Le droit de mutation est de 2 % pour les résidences principales. Pour les investissements locatifs et résidences secondaires, le taux est de 10,4 % depuis 2023. Les primo-accédants de moins de 35 ans bénéficient d'une exonération totale (pour un bien ≤ 510 000 €).",
    fiscalite: [
      "Box 3 : imposition forfaitaire sur le patrimoine immobilier net (hors résidence principale)",
      "Hypotheekrenteaftrek : déduction des intérêts hypothécaires sur 30 ans pour la résidence principale",
      "Eigenwoningforfait : ajout d'un revenu fictif de 0,35 % de la valeur WOZ",
      "Pas d'impôt sur les plus-values pour les particuliers",
    ],
    tips: [
      "L'exonération des droits de mutation pour les jeunes primo-accédants est un avantage considérable",
      "La déductibilité des intérêts hypothécaires reste l'un des plus puissants avantages fiscaux européens",
      "Le taux de 10,4 % pour l'investissement locatif pèse lourdement sur la rentabilité initiale",
    ],
    highlight: "Déductibilité unique des intérêts hypothécaires en Europe",
  },
  {
    id: "allemagne",
    name: "Allemagne",
    flag: "🇩🇪",
    fraisNotaire:
      "Les frais de notaire en Allemagne représentent environ 1,5–2 % du prix d'achat. Les frais totaux d'acquisition (Kaufnebenkosten) atteignent 9–15 % selon le Land, incluant notaire, registre foncier et droits de mutation.",
    droitsMutation:
      "La Grunderwerbsteuer varie selon le Land : de 3,5 % (Bavière, Saxe) à 6,5 % (Brandebourg, Thuringe, Schleswig-Holstein). Berlin et la Rhénanie-du-Nord-Westphalie appliquent 6,0 %. Aucun abattement n'est prévu pour les primo-accédants.",
    fiscalite: [
      "Grundsteuer (taxe foncière) : réformée en 2025, basée sur la nouvelle valeur cadastrale",
      "Plus-values immobilières : exonération totale après 10 ans de détention (Spekulationsfrist)",
      "Revenus locatifs imposés au barème progressif (14–45 %) avec amortissement linéaire de 2–3 %/an",
      "Pas d'impôt sur la fortune depuis 1997",
    ],
    tips: [
      "L'exonération des plus-values après 10 ans est l'un des régimes les plus favorables d'Europe",
      "L'amortissement linéaire de 3 % pour les constructions neuves (depuis 2023) optimise la fiscalité locative",
      "Les prix immobiliers ont corrigé de 8–12 % depuis 2022, créant des opportunités d'achat",
    ],
    highlight: "Exonération totale des plus-values après 10 ans",
  },
];

const tocItems = countries.map((c) => ({
  id: c.id,
  label: `${c.flag} ${c.name}`,
}));

export default function Guide() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_250)]">
      {/* Navigation Bar */}
      <nav className="border-b border-[oklch(0.18_0.02_250)] bg-[oklch(0.10_0.02_250)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <span
              className="font-black text-lg tracking-widest cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-white">JE</span>
              <span className="gold-text">V</span>
              <span className="text-white">ALIS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog">
              <span className="text-[oklch(0.55_0.02_250)] hover:text-white transition-colors cursor-pointer text-sm">
                Blog
              </span>
            </Link>
            <Link href="/simulation">
              <Button
                size="sm"
                className="bg-gold text-[oklch(0.10_0.02_250)] hover:bg-gold-dim font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Calculator className="w-4 h-4" />
                Simuler
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.14_0.04_250)] via-[oklch(0.10_0.02_250)] to-[oklch(0.08_0.01_250)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-6 text-sm px-4 py-1.5">
            <BookOpen className="w-4 h-4 mr-2" />
            Guide Premium 2025-2026
          </Badge>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Guide Immobilier
            <br />
            <span className="gold-text">Européen</span> 2025-2026
          </h1>
          <p
            className="text-lg md:text-xl text-[oklch(0.55_0.02_250)] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Édition JEVALIS
          </p>
          <p className="text-[oklch(0.50_0.02_250)] max-w-2xl mx-auto mt-4 text-base leading-relaxed">
            Frais de notaire, droits de mutation, fiscalité immobilière — tout ce qu'il faut
            savoir pour investir dans les 6 principaux marchés d'Europe francophone et limitrophe.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => scrollTo("toc")}
              className="text-gold hover:text-gold-dim transition-colors flex flex-col items-center gap-1 text-sm"
            >
              Découvrir le guide
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <section id="toc" className="container mx-auto px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-5 h-5 text-gold" />
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sommaire
            </h2>
          </div>
          <Card className="bg-[oklch(0.12_0.02_250)] border-[oklch(0.20_0.02_250)]">
            <CardContent className="p-6">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tocItems.map((item, i) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className="flex items-center gap-3 text-left w-full group px-3 py-2.5 rounded-lg hover:bg-[oklch(0.16_0.02_250)] transition-colors"
                    >
                      <span className="text-gold font-mono text-sm w-6">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[oklch(0.75_0.01_250)] group-hover:text-white transition-colors text-sm font-medium">
                        {item.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold/0 group-hover:text-gold/80 transition-all ml-auto" />
                    </button>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-[oklch(0.14_0.04_85)]/10 to-[oklch(0.12_0.02_250)] border-gold/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex gap-4 items-start">
                <Globe className="w-6 h-6 text-gold shrink-0 mt-1" />
                <div>
                  <h3
                    className="text-lg font-semibold text-white mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Pourquoi ce guide ?
                  </h3>
                  <p className="text-[oklch(0.65_0.01_250)] leading-relaxed text-sm">
                    L'acquisition immobilière en Europe est un exercice complexe où les frais
                    annexes — souvent sous-estimés — peuvent représenter de 2 % à plus de 15 %
                    du prix d'achat selon le pays. Ce guide compare de manière structurée les
                    frais de notaire, droits de mutation, fiscalité courante et stratégies
                    d'optimisation pour six marchés clés. Chaque section fournit des données
                    fiscales actualisées pour 2025-2026.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Country Sections */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {countries.map((country, idx) => (
            <section key={country.id} id={country.id} className="scroll-mt-20">
              {/* Country Header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{country.flag}</span>
                <div>
                  <p className="text-gold text-xs font-semibold tracking-widest uppercase">
                    {String(idx + 1).padStart(2, "0")} / {String(countries.length).padStart(2, "0")}
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {country.name}
                  </h2>
                </div>
                <Badge className="ml-auto bg-gold/10 text-gold border-gold/20 text-xs hidden sm:flex">
                  {country.highlight}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Frais de notaire */}
                <Card className="bg-[oklch(0.12_0.02_250)] border-[oklch(0.20_0.02_250)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-white">
                      <Scale className="w-4 h-4 text-gold" />
                      Frais de notaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-[oklch(0.60_0.01_250)] text-sm leading-relaxed">
                      {country.fraisNotaire}
                    </p>
                  </CardContent>
                </Card>

                {/* Droits de mutation */}
                <Card className="bg-[oklch(0.12_0.02_250)] border-[oklch(0.20_0.02_250)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-white">
                      <Landmark className="w-4 h-4 text-gold" />
                      Droits de mutation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-[oklch(0.60_0.01_250)] text-sm leading-relaxed">
                      {country.droitsMutation}
                    </p>
                  </CardContent>
                </Card>

                {/* Fiscalité */}
                <Card className="bg-[oklch(0.12_0.02_250)] border-[oklch(0.20_0.02_250)] md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-white">
                      <Euro className="w-4 h-4 text-gold" />
                      Fiscalité immobilière
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {country.fiscalite.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[oklch(0.60_0.01_250)] text-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-[oklch(0.14_0.04_85)]/5 border-gold/15 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-gold">
                      <Lightbulb className="w-4 h-4" />
                      Conseils JEVALIS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {country.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[oklch(0.70_0.01_250)] text-sm"
                        >
                          <Shield className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <section className="border-y border-[oklch(0.18_0.02_250)]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Building2 className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Calculez vos frais en{" "}
              <span className="gold-text">30 secondes</span>
            </h2>
            <p className="text-[oklch(0.55_0.02_250)] mb-8 text-sm max-w-lg mx-auto">
              Notre simulateur intègre les barèmes officiels de chaque pays pour vous
              fournir une estimation précise et détaillée de vos frais d'acquisition.
            </p>
            <Link href="/simulation">
              <Button
                size="lg"
                className="bg-gold text-[oklch(0.10_0.02_250)] hover:bg-gold-dim font-semibold px-8"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Calculator className="w-5 h-5" />
                Lancer une simulation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparative Quick Reference */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-5 h-5 text-gold" />
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Comparatif express
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[oklch(0.20_0.02_250)]">
                  <th className="text-left py-3 px-4 text-[oklch(0.50_0.02_250)] font-medium">
                    Pays
                  </th>
                  <th className="text-left py-3 px-4 text-[oklch(0.50_0.02_250)] font-medium">
                    Frais totaux
                  </th>
                  <th className="text-left py-3 px-4 text-[oklch(0.50_0.02_250)] font-medium">
                    Droits de mutation
                  </th>
                  <th className="text-left py-3 px-4 text-[oklch(0.50_0.02_250)] font-medium hidden md:table-cell">
                    Plus-value
                  </th>
                </tr>
              </thead>
              <tbody className="text-[oklch(0.70_0.01_250)]">
                {[
                  { flag: "🇫🇷", name: "France", frais: "7–8 %", dm: "5,80 %", pv: "Abattement progressif" },
                  { flag: "🇨🇭", name: "Suisse", frais: "1–5 %", dm: "0–3,3 %", pv: "Dégressif cantonal" },
                  { flag: "🇧🇪", name: "Belgique", frais: "10–15 %", dm: "3–12,5 %", pv: "Exonéré après 5 ans" },
                  { flag: "🇱🇺", name: "Luxembourg", frais: "7–10 %", dm: "7 %", pv: "Demi-taux après 2 ans" },
                  { flag: "🇳🇱", name: "Pays-Bas", frais: "1–2 %", dm: "2–10,4 %", pv: "Non imposée" },
                  { flag: "🇩🇪", name: "Allemagne", frais: "9–15 %", dm: "3,5–6,5 %", pv: "Exonéré après 10 ans" },
                ].map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-[oklch(0.15_0.02_250)] hover:bg-[oklch(0.12_0.02_250)] transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {row.flag} {row.name}
                    </td>
                    <td className="py-3 px-4">{row.frais}</td>
                    <td className="py-3 px-4">{row.dm}</td>
                    <td className="py-3 px-4 hidden md:table-cell">{row.pv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[oklch(0.40_0.02_250)] text-xs mt-4 italic">
            * Données indicatives actualisées pour 2025. Consultez un professionnel pour votre situation spécifique.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.15_0.02_250)] bg-[oklch(0.07_0.01_250)]">
        <div className="container mx-auto px-4 py-10 text-center">
          <Link href="/">
            <span
              className="font-black text-lg tracking-widest cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-white">JE</span>
              <span className="gold-text">V</span>
              <span className="text-white">ALIS</span>
            </span>
          </Link>
          <p className="text-[oklch(0.40_0.02_250)] text-xs mt-3">
            © {new Date().getFullYear()} JEVALIS — Guide Immobilier Européen. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
