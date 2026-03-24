import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  FileText,
  Scale,
  Home,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Globe,
  Calculator,
} from "lucide-react";

interface CountryData {
  name: string;
  flag: string;
  slug: string;
  heroDescription: string;
  fraisNotaire: { taux: string; details: string };
  droitsMutation: { taux: string; details: string };
  taxeFonciere: { taux: string; details: string };
  plusValue: { taux: string; details: string };
  faqs: { question: string; answer: string }[];
  relatedCountries: string[];
  metaTitle: string;
  metaDescription: string;
}

const COUNTRY_DATA: Record<string, CountryData> = {
  france: {
    name: "France",
    flag: "🇫🇷",
    slug: "france",
    heroDescription:
      "Découvrez la fiscalité immobilière française : frais de notaire, droits de mutation, taxe foncière et imposition des plus-values. Tout ce qu'il faut savoir avant d'investir en France.",
    fraisNotaire: {
      taux: "7 à 8 % (ancien) / 2 à 3 % (neuf)",
      details:
        "Les frais de notaire en France incluent les droits de mutation (environ 5,8 %), les émoluments du notaire (environ 1 %) et les frais divers (débours, formalités). Dans le neuf, les droits de mutation sont réduits à environ 0,7 %, ce qui abaisse le total à 2-3 %.",
    },
    droitsMutation: {
      taux: "5,80 % (taux départemental plein)",
      details:
        "Les droits de mutation à titre onéreux (DMTO) se composent d'une taxe départementale (jusqu'à 4,50 %), d'une taxe communale (1,20 %) et d'un prélèvement pour l'État (0,10 %). Certains départements appliquent un taux réduit de 3,80 %.",
    },
    taxeFonciere: {
      taux: "Variable selon la commune (10 à 60 % de la valeur locative cadastrale)",
      details:
        "La taxe foncière est calculée sur la valeur locative cadastrale du bien, revalorisée annuellement. Le taux varie considérablement entre les communes. Les propriétés neuves peuvent bénéficier d'une exonération temporaire de 2 ans.",
    },
    plusValue: {
      taux: "19 % + 17,2 % de prélèvements sociaux",
      details:
        "La plus-value immobilière est taxée à un taux forfaitaire de 19 % pour l'impôt sur le revenu, plus 17,2 % de prélèvements sociaux. Des abattements pour durée de détention s'appliquent : exonération totale après 22 ans (IR) et 30 ans (PS). La résidence principale est exonérée.",
    },
    faqs: [
      {
        question: "Quels sont les frais de notaire pour un achat immobilier en France ?",
        answer:
          "Les frais de notaire en France représentent environ 7 à 8 % du prix d'achat dans l'ancien et 2 à 3 % dans le neuf. Ils incluent les droits de mutation, les émoluments du notaire et les frais administratifs divers. Ces frais sont à la charge de l'acquéreur et doivent être payés le jour de la signature de l'acte authentique.",
      },
      {
        question: "Comment est calculée la taxe foncière en France ?",
        answer:
          "La taxe foncière est calculée en multipliant la valeur locative cadastrale du bien (après un abattement de 50 %) par les taux votés par les collectivités locales. Ces taux varient fortement d'une commune à l'autre. La valeur locative est revalorisée chaque année par un coefficient fixé en loi de finances.",
      },
      {
        question: "La plus-value immobilière est-elle toujours taxée en France ?",
        answer:
          "Non. La résidence principale est totalement exonérée de taxe sur la plus-value. Pour les résidences secondaires et les investissements locatifs, des abattements progressifs s'appliquent selon la durée de détention : exonération totale de l'impôt sur le revenu après 22 ans et des prélèvements sociaux après 30 ans.",
      },
      {
        question: "Existe-t-il des dispositifs fiscaux avantageux pour investir en France ?",
        answer:
          "Oui, plusieurs dispositifs existent : le Pinel (réduction d'impôt pour l'investissement locatif dans le neuf), le Denormandie (ancien avec travaux), le déficit foncier, le statut LMNP (Loueur Meublé Non Professionnel) avec amortissement du bien, et la loi Malraux pour la rénovation en secteur sauvegardé.",
      },
    ],
    relatedCountries: ["suisse", "belgique", "luxembourg"],
    metaTitle: "Fiscalité immobilière en France | Frais de notaire, taxes et plus-values – JEVALIS",
    metaDescription:
      "Guide complet de la fiscalité immobilière française : frais de notaire, droits de mutation, taxe foncière, plus-values. Simulez vos frais avec JEVALIS.",
  },
  suisse: {
    name: "Suisse",
    flag: "🇨🇭",
    slug: "suisse",
    heroDescription:
      "Explorez la fiscalité immobilière suisse : frais d'acquisition, droits de mutation cantonaux, impôt foncier et imposition des gains immobiliers. Un marché attractif avec des règles propres à chaque canton.",
    fraisNotaire: {
      taux: "0,1 à 5 % selon le canton",
      details:
        "En Suisse, les frais de notaire varient considérablement selon le canton. Certains cantons comme Zurich n'ont pas de droits de mutation, tandis que Genève applique un taux de 3 %. Les émoluments du notaire sont également réglementés au niveau cantonal et représentent généralement 0,1 à 0,5 % du prix.",
    },
    droitsMutation: {
      taux: "0 à 3,3 % selon le canton",
      details:
        "Les droits de mutation (droits de timbre) sont fixés par chaque canton. Zurich, Schwytz et Uri ne prélèvent aucun droit. Genève applique 3 %, Vaud 3,3 %, et le Valais 1,5 %. Certains cantons partagent les frais entre acheteur et vendeur.",
    },
    taxeFonciere: {
      taux: "0,1 à 0,3 % de la valeur fiscale (selon le canton)",
      details:
        "L'impôt foncier suisse est relativement modéré. Il est calculé sur la valeur fiscale du bien immobilier, déterminée par le canton. Certains cantons comme Zurich ne prélèvent pas d'impôt foncier communal. La valeur locative (Eigenmietwert) est en revanche imposée comme un revenu.",
    },
    plusValue: {
      taux: "Variable : 10 à 60 % (dégressif avec la durée de détention)",
      details:
        "L'impôt sur les gains immobiliers en Suisse est prélevé au niveau cantonal. Le taux est généralement dégressif : plus la durée de détention est longue, plus le taux est faible. Après 20-25 ans selon les cantons, le taux peut descendre à 10-15 %. Les gains à court terme (< 2 ans) sont lourdement taxés.",
    },
    faqs: [
      {
        question: "Pourquoi les frais varient-ils autant d'un canton suisse à l'autre ?",
        answer:
          "La Suisse est un État fédéral où chaque canton dispose d'une large autonomie fiscale. Cela signifie que les droits de mutation, les impôts fonciers et les taux d'imposition des plus-values sont fixés localement. Un même achat peut coûter 3 % de plus à Genève qu'à Zurich en termes de droits de mutation.",
      },
      {
        question: "Qu'est-ce que la valeur locative en Suisse ?",
        answer:
          "La valeur locative (Eigenmietwert) est un revenu fictif que les propriétaires suisses doivent déclarer comme revenu imposable. Elle correspond au loyer que le propriétaire pourrait percevoir s'il louait son bien. En contrepartie, les intérêts hypothécaires et les frais d'entretien sont déductibles du revenu imposable.",
      },
      {
        question: "Les étrangers peuvent-ils acheter un bien immobilier en Suisse ?",
        answer:
          "L'achat immobilier par des étrangers en Suisse est réglementé par la loi fédérale sur l'acquisition d'immeubles par des personnes à l'étranger (Lex Koller). Les résidents avec un permis C peuvent acheter librement. Les titulaires d'un permis B peuvent acheter leur résidence principale. L'achat d'un bien de rendement est soumis à autorisation.",
      },
    ],
    relatedCountries: ["france", "allemagne", "luxembourg"],
    metaTitle: "Fiscalité immobilière en Suisse | Frais, impôts et gains immobiliers – JEVALIS",
    metaDescription:
      "Guide complet de la fiscalité immobilière suisse : frais d'acquisition, droits de mutation cantonaux, impôt foncier, gains immobiliers. Simulez avec JEVALIS.",
  },
  belgique: {
    name: "Belgique",
    flag: "🇧🇪",
    slug: "belgique",
    heroDescription:
      "Tout savoir sur la fiscalité immobilière belge : droits d'enregistrement régionaux, précompte immobilier, taxation des plus-values et mécanismes d'abattement. Un marché accessible avec des spécificités régionales.",
    fraisNotaire: {
      taux: "11 à 15 % (droits d'enregistrement + frais notariaux)",
      details:
        "Les frais d'acquisition en Belgique comprennent les droits d'enregistrement (6 à 12,5 % selon la région) et les honoraires du notaire (environ 1 à 2 %). En Flandre, le taux de base est de 3 % pour la résidence principale (depuis 2022). En Wallonie et à Bruxelles, il est de 12,5 % avec des abattements possibles.",
    },
    droitsMutation: {
      taux: "3 % (Flandre, rés. principale) / 12,5 % (Wallonie et Bruxelles)",
      details:
        "Les droits d'enregistrement en Belgique varient selon la région. La Flandre a réduit son taux à 3 % pour la résidence principale (1 % pour les rénovations énergétiques). En Wallonie et à Bruxelles, le taux standard est de 12,5 %, mais un abattement réduit la base imposable (jusqu'à 175 000 € à Bruxelles).",
    },
    taxeFonciere: {
      taux: "Précompte immobilier : 25 à 55 % du revenu cadastral",
      details:
        "Le précompte immobilier belge est calculé sur le revenu cadastral (RC) du bien, une valeur théorique fixée par l'administration. Le taux global combine la contribution régionale, provinciale et communale, et varie fortement. Le RC est indexé annuellement mais basé sur des valeurs de 1975.",
    },
    plusValue: {
      taux: "16,5 % (< 5 ans) / 0 % (> 5 ans pour particuliers)",
      details:
        "En Belgique, la plus-value sur un bien immobilier détenu plus de 5 ans est exonérée d'impôt pour les particuliers (gestion normale du patrimoine). Pour les reventes dans les 5 ans, un taux de 16,5 % s'applique (+ additionnels communaux). La résidence principale est toujours exonérée, quelle que soit la durée de détention.",
    },
    faqs: [
      {
        question: "Pourquoi la Flandre est-elle plus avantageuse fiscalement pour acheter ?",
        answer:
          "Depuis 2022, la Flandre a réduit les droits d'enregistrement à 3 % pour l'achat d'une résidence principale unique (contre 12,5 % en Wallonie et à Bruxelles). Pour les biens nécessitant une rénovation énergétique importante, le taux peut même descendre à 1 %. Cela représente une économie considérable sur un achat immobilier.",
      },
      {
        question: "Qu'est-ce que le revenu cadastral en Belgique ?",
        answer:
          "Le revenu cadastral (RC) est un revenu fictif annuel attribué à chaque bien immobilier, correspondant au loyer net théorique. Bien qu'il soit basé sur des valeurs de 1975, il est indexé chaque année. Le RC sert de base au calcul du précompte immobilier et à la déclaration fiscale des propriétaires.",
      },
      {
        question: "La plus-value immobilière est-elle toujours exonérée en Belgique ?",
        answer:
          "Pas toujours. Si vous revendez un bien dans les 5 ans suivant l'achat (hors résidence principale), un impôt de 16,5 % sur la plus-value s'applique. Au-delà de 5 ans, l'exonération est totale pour les particuliers dans le cadre d'une gestion normale de leur patrimoine privé. Les activités spéculatives peuvent être requalifiées.",
      },
    ],
    relatedCountries: ["france", "luxembourg", "pays-bas"],
    metaTitle: "Fiscalité immobilière en Belgique | Droits d'enregistrement et taxes – JEVALIS",
    metaDescription:
      "Guide complet de la fiscalité immobilière belge : droits d'enregistrement, précompte immobilier, plus-values. Comparez les régions et simulez avec JEVALIS.",
  },
  luxembourg: {
    name: "Luxembourg",
    flag: "🇱🇺",
    slug: "luxembourg",
    heroDescription:
      "La fiscalité immobilière luxembourgeoise : droits d'enregistrement modérés, impôt foncier faible et avantages fiscaux pour les investisseurs. Un micro-marché avec des prix élevés mais une fiscalité attractive.",
    fraisNotaire: {
      taux: "7 à 10 % (droits + frais notariaux)",
      details:
        "Les frais d'acquisition au Luxembourg comprennent les droits d'enregistrement (6 %), les droits de transcription (1 %), et les honoraires du notaire (environ 1-2 %). Un crédit d'impôt (Bëllegen Akt) de 20 000 € par personne est accordé pour l'achat d'une résidence principale, réduisant significativement la charge.",
    },
    droitsMutation: {
      taux: "7 % (6 % enregistrement + 1 % transcription)",
      details:
        "Les droits d'enregistrement au Luxembourg sont de 6 %, auxquels s'ajoutent 1 % de droits de transcription. Le mécanisme du 'Bëllegen Akt' permet un crédit d'impôt de 20 000 € par acquéreur (40 000 € pour un couple) applicable sur les droits d'enregistrement de la résidence principale.",
    },
    taxeFonciere: {
      taux: "0,7 à 1 % de la valeur unitaire (très faible)",
      details:
        "L'impôt foncier au Luxembourg est calculé sur la 'valeur unitaire' du bien, une valeur administrative souvent très inférieure à la valeur de marché (basée sur des estimations de 1941). Les taux communaux (multiplicateurs) varient de 200 à 900 %, mais la base faible maintient l'impôt très modéré.",
    },
    plusValue: {
      taux: "Quart du taux global (> 2 ans) / taux normal (< 2 ans)",
      details:
        "Au Luxembourg, les plus-values immobilières réalisées après 2 ans de détention bénéficient d'un taux réduit (quart du taux global, soit environ 10-12 %). Les reventes dans les 2 ans sont imposées au barème progressif. Un abattement de 50 000 € (100 000 € en couple) s'applique sur les plus-values à long terme.",
    },
    faqs: [
      {
        question: "Qu'est-ce que le Bëllegen Akt au Luxembourg ?",
        answer:
          "Le Bëllegen Akt est un crédit d'impôt luxembourgeois de 20 000 € par personne (40 000 € pour un couple) applicable lors de l'achat d'une résidence principale. Il permet de réduire significativement les droits d'enregistrement. Ce crédit ne peut être utilisé qu'une seule fois dans la vie de l'acquéreur et s'applique uniquement à la résidence principale.",
      },
      {
        question: "Pourquoi l'impôt foncier est-il si faible au Luxembourg ?",
        answer:
          "L'impôt foncier luxembourgeois est basé sur la 'valeur unitaire' des biens, une estimation administrative datant de 1941. Cette base étant très inférieure à la valeur de marché actuelle, l'impôt reste très faible malgré les multiplicateurs communaux. Une réforme est en cours pour réévaluer ces bases.",
      },
      {
        question: "Le Luxembourg est-il un bon pays pour investir dans l'immobilier ?",
        answer:
          "Le Luxembourg offre une fiscalité attractive (impôt foncier faible, crédit d'impôt à l'acquisition, plus-values modérément taxées) et une demande locative très forte. Cependant, les prix immobiliers sont parmi les plus élevés d'Europe, ce qui nécessite un capital important. La rentabilité locative brute est généralement entre 3 et 4 %.",
      },
    ],
    relatedCountries: ["france", "belgique", "allemagne"],
    metaTitle: "Fiscalité immobilière au Luxembourg | Droits, taxes et investissement – JEVALIS",
    metaDescription:
      "Guide complet de la fiscalité immobilière luxembourgeoise : droits d'enregistrement, impôt foncier, plus-values, Bëllegen Akt. Simulez vos frais avec JEVALIS.",
  },
  "pays-bas": {
    name: "Pays-Bas",
    flag: "🇳🇱",
    slug: "pays-bas",
    heroDescription:
      "Comprendre la fiscalité immobilière néerlandaise : droits de mutation, WOZ-waarde, box 3 et imposition forfaitaire du patrimoine. Un système unique en Europe avec une approche forfaitaire des revenus immobiliers.",
    fraisNotaire: {
      taux: "3 à 8 % (droits de mutation + frais notariaux)",
      details:
        "Les frais d'acquisition aux Pays-Bas comprennent les droits de mutation (overdrachtsbelasting) de 2 % pour la résidence principale ou 10,4 % pour les investissements, plus les frais de notaire (environ 1 %). Les acheteurs de moins de 35 ans bénéficient d'une exonération totale pour leur première résidence (sous conditions).",
    },
    droitsMutation: {
      taux: "2 % (résidence principale) / 10,4 % (investissement)",
      details:
        "Les droits de mutation (overdrachtsbelasting) aux Pays-Bas sont de 2 % pour l'achat d'une résidence principale et de 10,4 % pour les investissements immobiliers et résidences secondaires. Les primo-accédants de moins de 35 ans achetant un bien sous 510 000 € sont exonérés (startersvrijstelling).",
    },
    taxeFonciere: {
      taux: "0,04 à 0,2 % de la WOZ-waarde",
      details:
        "La taxe foncière néerlandaise (OZB - Onroerendezaakbelasting) est basée sur la WOZ-waarde, une valeur déterminée annuellement par la commune et proche de la valeur de marché. Les taux varient par commune. Les propriétaires occupants ne paient que la part propriétaire, les propriétaires bailleurs paient propriétaire + utilisateur.",
    },
    plusValue: {
      taux: "Pas de taxe directe sur la plus-value (système Box 3)",
      details:
        "Les Pays-Bas n'imposent pas directement les plus-values immobilières des particuliers. En revanche, les biens immobiliers (hors résidence principale) sont soumis à l'impôt sur le patrimoine (Box 3) qui taxe un rendement forfaitaire présumé. La résidence principale est dans Box 1 et bénéficie de la déductibilité des intérêts hypothécaires.",
    },
    faqs: [
      {
        question: "Comment fonctionne le système Box 3 aux Pays-Bas ?",
        answer:
          "Le système Box 3 est un impôt sur le patrimoine néerlandais qui taxe un rendement fictif sur les actifs (dont l'immobilier locatif). Le rendement présumé varie selon la composition du patrimoine et est taxé à un taux forfaitaire de 36 %. La résidence principale est exclue de Box 3 et relève de Box 1.",
      },
      {
        question: "Qu'est-ce que la WOZ-waarde ?",
        answer:
          "La WOZ-waarde (Waardering Onroerende Zaken) est la valeur officielle d'un bien immobilier aux Pays-Bas, déterminée annuellement par la commune au 1er janvier. Elle sert de base au calcul de la taxe foncière (OZB), de l'impôt sur le patrimoine (Box 3) et de la taxe sur l'eau. Elle reflète la valeur de marché du bien.",
      },
      {
        question: "Les jeunes acheteurs bénéficient-ils d'avantages aux Pays-Bas ?",
        answer:
          "Oui, les primo-accédants de moins de 35 ans (startersvrijstelling) sont totalement exonérés des droits de mutation pour l'achat de leur première résidence principale, à condition que le prix ne dépasse pas 510 000 € (seuil 2024). Au-delà, le taux standard de 2 % s'applique sur la totalité.",
      },
    ],
    relatedCountries: ["france", "belgique", "allemagne"],
    metaTitle: "Fiscalité immobilière aux Pays-Bas | WOZ, Box 3 et droits de mutation – JEVALIS",
    metaDescription:
      "Guide complet de la fiscalité immobilière néerlandaise : droits de mutation, WOZ-waarde, Box 3, taxe foncière. Simulez vos frais avec JEVALIS.",
  },
  allemagne: {
    name: "Allemagne",
    flag: "🇩🇪",
    slug: "allemagne",
    heroDescription:
      "Découvrez la fiscalité immobilière allemande : Grunderwerbsteuer, taxe foncière réformée, Spekulationssteuer et mécanismes d'amortissement. Un marché stable avec une fiscalité transparente.",
    fraisNotaire: {
      taux: "7 à 15 % (Grunderwerbsteuer + notaire + agent)",
      details:
        "Les frais d'acquisition en Allemagne incluent la Grunderwerbsteuer (3,5 à 6,5 % selon le Land), les frais de notaire (environ 1,5 à 2 %), les frais d'inscription au registre foncier (0,5 %) et éventuellement la commission de l'agent immobilier (3 à 7 %). Sans agent, les frais tournent autour de 7-9 %.",
    },
    droitsMutation: {
      taux: "3,5 à 6,5 % selon le Land",
      details:
        "La Grunderwerbsteuer (taxe d'acquisition immobilière) varie selon les Länder : Bavière et Saxe appliquent 3,5 %, tandis que le Brandebourg, la Thuringe et le Schleswig-Holstein atteignent 6,5 %. Berlin et la Rhénanie-du-Nord-Westphalie sont à 6 %. Cette taxe est partagée entre acheteur et vendeur selon accord.",
    },
    taxeFonciere: {
      taux: "Réformée en 2025 : variable selon commune et Land",
      details:
        "La taxe foncière allemande (Grundsteuer) a été réformée en 2025. Le nouveau modèle fédéral utilise la valeur du terrain et le loyer moyen. Certains Länder (Bavière, Hambourg, Bade-Wurtemberg) ont adopté leurs propres modèles. Les taux communaux (Hebesätze) varient de 200 à 900 %. L'impôt reste généralement modéré.",
    },
    plusValue: {
      taux: "Barème progressif (< 10 ans) / 0 % (> 10 ans)",
      details:
        "En Allemagne, la plus-value immobilière (Spekulationssteuer) est imposée au barème progressif de l'impôt sur le revenu si le bien est revendu dans les 10 ans suivant l'achat. Au-delà de 10 ans, l'exonération est totale. La résidence principale est exonérée si elle a été occupée au moins les 2 dernières années.",
    },
    faqs: [
      {
        question: "Pourquoi les frais d'acquisition sont-ils si élevés en Allemagne ?",
        answer:
          "Les frais d'acquisition en Allemagne sont élevés en raison du cumul de la Grunderwerbsteuer (jusqu'à 6,5 %), des frais de notaire obligatoire (1,5-2 %), de l'inscription au registre foncier (0,5 %) et de la commission d'agent immobilier (3-7 %). Sans agent, les frais restent entre 7 et 9 % du prix d'achat.",
      },
      {
        question: "Qu'a changé la réforme de la Grundsteuer en 2025 ?",
        answer:
          "La réforme de 2025 a abandonné les anciennes valeurs unitaires (datant de 1935 à l'Ouest et 1964 à l'Est) au profit d'un nouveau calcul basé sur la valeur du terrain et les loyers moyens. Certains Länder ont adopté des modèles simplifiés (Bavière : surface pure, Bade-Wurtemberg : valeur du terrain uniquement).",
      },
      {
        question: "L'Allemagne est-elle intéressante pour l'investissement locatif ?",
        answer:
          "Oui, l'Allemagne offre un cadre favorable à l'investissement locatif grâce à l'amortissement du bâtiment (2 à 3 % par an déductible), l'exonération des plus-values après 10 ans, et la déductibilité des intérêts d'emprunt. Les grandes villes (Berlin, Munich, Hambourg) offrent une demande locative soutenue, bien que les rendements bruts soient modérés (3-5 %).",
      },
      {
        question: "Les frais de notaire sont-ils négociables en Allemagne ?",
        answer:
          "Non, les frais de notaire en Allemagne sont fixés par la loi (Gerichts- und Notarkostengesetz) et ne sont pas négociables. Ils représentent environ 1,5 à 2 % du prix d'achat. En revanche, la commission de l'agent immobilier est négociable et depuis 2020, elle doit être partagée entre acheteur et vendeur.",
      },
    ],
    relatedCountries: ["france", "suisse", "pays-bas"],
    metaTitle: "Fiscalité immobilière en Allemagne | Grunderwerbsteuer et impôts – JEVALIS",
    metaDescription:
      "Guide complet de la fiscalité immobilière allemande : Grunderwerbsteuer, Grundsteuer, Spekulationssteuer, amortissement. Simulez vos frais avec JEVALIS.",
  },
};

const FISCAL_SECTIONS = [
  { key: "fraisNotaire" as const, label: "Frais de notaire", icon: FileText },
  { key: "droitsMutation" as const, label: "Droits de mutation", icon: Scale },
  { key: "taxeFonciere" as const, label: "Taxe foncière", icon: Home },
  { key: "plusValue" as const, label: "Plus-value immobilière", icon: TrendingUp },
];

export default function CountryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "france";
  const country = COUNTRY_DATA[slug];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (country) {
      document.title = country.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", country.metaDescription);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = country.metaDescription;
        document.head.appendChild(meta);
      }
    }
  }, [country]);

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B1628" }}>
        <div className="text-center space-y-6">
          <h1
            className="text-3xl font-black text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pays non trouvé
          </h1>
          <p className="text-[oklch(0.60_0.02_250)]">
            Ce pays n'est pas encore couvert par notre guide fiscal.
          </p>
          <Link href="/">
            <Button className="gold-bg text-[#0B1628] font-bold rounded-none hover:opacity-90">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href="/">
            <span className="hover:text-white transition-colors">Guides fiscaux</span>
          </Link>
          <span>/</span>
          <span className="gold-text">{country.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1
                className="text-3xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Fiscalité immobilière
                <br />
                <span className="gold-text">en {country.name}</span>
              </h1>
            </div>
          </div>
          <p
            className="text-lg text-[oklch(0.65_0.02_250)] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {country.heroDescription}
          </p>
          <div className="section-divider mt-8" />
        </div>
      </section>

      {/* Fiscal Data Sections */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {FISCAL_SECTIONS.map((section) => {
            const data = country[section.key];
            const Icon = section.icon;
            return (
              <Card
                key={section.key}
                className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)] hover-lift"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#0B1628]" />
                    </div>
                    <CardTitle
                      className="text-white text-lg"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {section.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="gold-text font-bold text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                      {data.taux}
                    </span>
                  </div>
                  <p className="text-[oklch(0.60_0.02_250)] text-sm leading-relaxed">
                    {data.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-gradient-accent py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Calculator className="w-10 h-10 gold-text mx-auto mb-4" />
          <h2
            className="text-2xl md:text-3xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Simulez vos frais en{" "}
            <span className="gold-text">{country.name}</span>
          </h2>
          <p className="text-[oklch(0.60_0.02_250)] mb-8 max-w-xl mx-auto">
            Obtenez une estimation précise de tous vos frais d'acquisition, taxes et charges
            pour votre projet immobilier en {country.name}.
          </p>
          <Link href="/">
            <Button className="gold-bg text-[#0B1628] font-black px-8 py-3 rounded-none hover:opacity-90 text-base">
              Lancer la simulation {country.flag}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2
          className="text-2xl md:text-3xl font-black text-white mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Questions fréquentes
        </h2>
        <p className="text-[oklch(0.55_0.02_250)] mb-8">
          Fiscalité immobilière en {country.name} — les réponses à vos questions
        </p>
        <div className="space-y-3">
          {country.faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[oklch(0.22_0.03_250)] bg-[oklch(0.14_0.03_250)] transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span
                  className="text-white font-semibold text-sm md:text-base pr-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 gold-text shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[oklch(0.50_0.02_250)] shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5">
                  <p className="text-[oklch(0.60_0.02_250)] text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Countries */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2
          className="text-xl font-black text-white mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Globe className="w-5 h-5 gold-text inline mr-2" />
          Guides fiscaux liés
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {country.relatedCountries.map((relSlug) => {
            const related = COUNTRY_DATA[relSlug];
            if (!related) return null;
            return (
              <Link key={relSlug} href={`/fiscalite/${relSlug}`}>
                <Card className="bg-[oklch(0.14_0.03_250)] border-[oklch(0.22_0.03_250)] hover-lift cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-4">
                    <span className="text-3xl">{related.flag}</span>
                    <div>
                      <p
                        className="text-white font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {related.name}
                      </p>
                      <p className="text-[oklch(0.50_0.02_250)] text-xs">
                        Voir le guide fiscal →
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Internal Links */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap gap-3">
          <Link href="/comparateur/france-vs-suisse">
            <span className="text-sm text-[oklch(0.55_0.02_250)] hover:gold-text transition-colors underline underline-offset-4">
              Comparer France vs Suisse
            </span>
          </Link>
          <Link href="/rendement-locatif">
            <span className="text-sm text-[oklch(0.55_0.02_250)] hover:gold-text transition-colors underline underline-offset-4">
              Simulateur de rendement locatif
            </span>
          </Link>
          <Link href="/blog">
            <span className="text-sm text-[oklch(0.55_0.02_250)] hover:gold-text transition-colors underline underline-offset-4">
              Blog immobilier
            </span>
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
