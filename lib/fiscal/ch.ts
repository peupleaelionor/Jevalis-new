import { SimulationInput, SimulationResult, TaxBreakdown } from "./types";

function chFederalTax(income: number): number {
  // Swiss federal tax brackets (simplified, single)
  if (income <= 17800) return 0;
  if (income <= 31600) return (income - 17800) * 0.077;
  if (income <= 41400) return 1062 + (income - 31600) * 0.088;
  if (income <= 55200) return 1924 + (income - 41400) * 0.11;
  if (income <= 72500) return 3442 + (income - 55200) * 0.132;
  if (income <= 78100) return 5726 + (income - 72500) * 0.143;
  if (income <= 103600) return 6527 + (income - 78100) * 0.165;
  if (income <= 134600) return 10733 + (income - 103600) * 0.176;
  if (income <= 176000) return 16189 + (income - 134600) * 0.187;
  if (income <= 755200) return 23931 + (income - 176000) * 0.209;
  return 144990 + (income - 755200) * 0.115;
}

export function calculateCH(input: SimulationInput): SimulationResult {
  const acquisitionCosts = input.propertyValue * 0.02; // 2% droits mutation
  const rentalIncome = input.propertyType === "rental" ? input.annualRentalIncome : 0;

  // Imputed rental value (valeur locative) for primary residence
  const imputedRental = input.propertyType === "primary"
    ? input.propertyValue * 0.035 // ~3.5% of market value
    : 0;

  // Deductible expenses
  const maintenanceDeduction = rentalIncome * 0.20; // 20% flat rate
  const netRentalIncome = rentalIncome - maintenanceDeduction;
  const taxableRentalBase = netRentalIncome + imputedRental;

  // Combined cantonal + federal income tax (estimate based on Zurich rates)
  const cantonalRate = 0.28; // average cantonal rate
  const federalTax = chFederalTax(input.otherIncome + taxableRentalBase) - chFederalTax(input.otherIncome);
  const cantonalTax = taxableRentalBase * cantonalRate;
  const incomeTax = federalTax + cantonalTax;

  // Wealth tax on net property value
  const propertyTax = input.propertyValue * 0.003; // ~0.3% wealth tax

  // Capital gains: cantonal tax only, varies by holding period
  const capitalGain = Math.max(0, input.propertyValue * 0.25);
  const holdingReduction = Math.min(0.50, input.ownershipYears * 0.02); // 2% per year, max 50%
  const capitalGainsTax = capitalGain * 0.25 * (1 - holdingReduction);

  const socialCharges = 0; // Switzerland has no "prélèvements sociaux"

  const totalTax = incomeTax + propertyTax + capitalGainsTax;
  const totalInvestment = input.propertyValue + acquisitionCosts;
  const effectiveRate = (totalTax / totalInvestment) * 100;
  const grossYield = input.propertyValue > 0 ? (rentalIncome / input.propertyValue) * 100 : 0;
  const netYield = ((rentalIncome - incomeTax - propertyTax) / totalInvestment) * 100;
  const netReturn = rentalIncome - incomeTax - propertyTax;

  const breakdown: TaxBreakdown[] = [
    { label: "Impôt fédéral direct", amount: Math.round(federalTax) },
    { label: "Impôt cantonal (Zurich indicatif)", amount: Math.round(cantonalTax) },
    { label: "Impôt sur la fortune", amount: Math.round(propertyTax), rate: 0.3 },
    { label: "Impôt sur les gains immobiliers", amount: Math.round(capitalGainsTax), note: `Réduction ${(holdingReduction * 100).toFixed(0)}%` },
    { label: "Frais d'acquisition", amount: Math.round(acquisitionCosts), rate: 2 },
  ];

  const keyPoints = [
    `Valeur locative imposable (résidence principale) : ${Math.round(imputedRental).toLocaleString("fr-FR")} CHF/an`,
    `Déduction pour entretien : 20% des loyers encaissés`,
    `Impôt sur la fortune : ~0,3% de la valeur vénale`,
    `Plus-value : réduction de 2%/an de détention (max 50%)`,
  ];

  const warnings = [
    "Les taux varient fortement selon le canton — Genève, Zurich et Berne ont des fiscalités distinctes",
    "La valeur locative est obligatoirement déclarée même pour la résidence principale",
    input.propertyValue > 500_000
      ? "Au-delà de 500 000 CHF, l'impôt sur la fortune peut être significatif"
      : "",
  ].filter(Boolean);

  const recommendations = [
    "Comparer les cantons : fiscalité résidentielle très variable (Zoug vs Genève)",
    "Optimiser via les déductions d'entretien (taux réel vs forfait)",
    "Considérer le rachat du 2ème / 3ème pilier pour financer l'achat",
  ];

  return {
    country: "CH",
    countryName: "Suisse",
    taxableBase: Math.round(taxableRentalBase),
    incomeTax: Math.round(incomeTax),
    socialCharges,
    capitalGainsTax: Math.round(capitalGainsTax),
    propertyTax: Math.round(propertyTax),
    acquisitionCosts: Math.round(acquisitionCosts),
    totalTax: Math.round(totalTax),
    effectiveRate: Math.round(effectiveRate * 10) / 10,
    grossYield: Math.round(grossYield * 100) / 100,
    netYield: Math.round(netYield * 100) / 100,
    netReturn: Math.round(netReturn),
    breakdown,
    keyPoints,
    warnings,
    recommendations,
  };
}
