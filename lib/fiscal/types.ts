export interface SimulationInput {
  country: string;
  propertyValue: number;
  annualRentalIncome: number;
  ownershipYears: number;
  propertyType: "primary" | "rental" | "commercial";
  isResident: boolean;
  filingStatus: "single" | "married" | "pacsed";
  otherIncome: number;
}

export interface TaxBreakdown {
  label: string;
  amount: number;
  rate?: number;
  note?: string;
}

export interface SimulationResult {
  country: string;
  countryName: string;
  taxableBase: number;
  incomeTax: number;
  socialCharges: number;
  capitalGainsTax: number;
  propertyTax: number;
  acquisitionCosts: number;
  totalTax: number;
  effectiveRate: number;
  grossYield: number;
  netYield: number;
  netReturn: number;
  breakdown: TaxBreakdown[];
  keyPoints: string[];
  warnings: string[];
  recommendations: string[];
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  language: string;
  headline: string;
  keyFacts: string[];
}

export const COUNTRIES: Record<string, CountryInfo> = {
  FR: {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    language: "fr",
    headline: "Fiscalité immobilière progressive avec prélèvements sociaux élevés",
    keyFacts: [
      "Impôt sur le revenu locatif jusqu'à 45%",
      "Prélèvements sociaux : 17,2%",
      "Plus-value exonérée après 22 ans (IR) / 30 ans (PS)",
      "IFI au-delà de 1,3M€ de patrimoine net",
      "Frais de notaire : 7–8% pour l'ancien",
    ],
  },
  CH: {
    code: "CH",
    name: "Suisse",
    flag: "🇨🇭",
    currency: "CHF",
    language: "fr",
    headline: "Système cantonal avec valeur locative et imposition de la fortune",
    keyFacts: [
      "Valeur locative imposable même en résidence principale",
      "Impôt sur la fortune immobilière",
      "Plus-value : imposition cantonale variable",
      "Déductions pour intérêts hypothécaires et entretien",
      "Droits de mutation : 1–3% selon le canton",
    ],
  },
  BE: {
    code: "BE",
    name: "Belgique",
    flag: "🇧🇪",
    currency: "EUR",
    language: "fr",
    headline: "Revenu cadastral comme base d'imposition principale",
    keyFacts: [
      "Précompte immobilier basé sur le RC indexé",
      "Plus-value privée exonérée après 5 ans",
      "Droits d'enregistrement : 12,5% (Wallonie) / 10% (Flandre)",
      "Loyer non imposé si bien donné en habitation",
      "Pas d'IFI en Belgique",
    ],
  },
  LU: {
    code: "LU",
    name: "Luxembourg",
    flag: "🇱🇺",
    currency: "EUR",
    language: "fr",
    headline: "Fiscalité favorable pour les non-résidents et investisseurs",
    keyFacts: [
      "Taux d'imposition réduit sur plus-values longue durée",
      "Abattement de 50% sur les plus-values après 2 ans",
      "Droits d'enregistrement : 6–7%",
      "Amortissement accéléré pour biens locatifs",
      "Pas de précompte immobilier national",
    ],
  },
  NL: {
    code: "NL",
    name: "Pays-Bas",
    flag: "🇳🇱",
    currency: "EUR",
    language: "nl",
    headline: "Box 3 sur le patrimoine net avec rendement forfaitaire",
    keyFacts: [
      "Box 3 : imposition sur rendement fictif du patrimoine",
      "Taux Box 3 : 36% sur rendement présumé",
      "Droits de mutation : 2% (résidence) / 10,4% (investissement)",
      "Plus-value exonérée en résidence principale",
      "Déduction des intérêts hypothécaires (Box 1)",
    ],
  },
  DE: {
    code: "DE",
    name: "Allemagne",
    flag: "🇩🇪",
    currency: "EUR",
    language: "de",
    headline: "Exonération des plus-values après 10 ans de détention",
    keyFacts: [
      "Plus-value exonérée après 10 ans (Spekulationsfrist)",
      "Revenus locatifs imposés au taux marginal",
      "Amortissement (AfA) : 2% ou 3% par an",
      "Droits de mutation : 3,5–6,5% selon le Land",
      "Solidarity surcharge : 5,5% sur l'impôt",
    ],
  },
};
