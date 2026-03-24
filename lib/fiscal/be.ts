import { SimulationInput, SimulationResult, TaxBreakdown } from "./types";

export function calculateBE(input: SimulationInput): SimulationResult {
  const acquisitionCosts = input.propertyValue * 0.125; // 12.5% droits d'enregistrement Wallonie

  const rentalIncome = input.propertyType === "rental" ? input.annualRentalIncome : 0;

  // Revenu cadastral (RC) — simplified estimate
  const cadastralIncome = input.propertyValue * 0.022 * 1.9264; // indexation 2024

  // Pour les locations à usage d'habitation privée : RC indexé * 1.4 est imposé
  // Les loyers eux-mêmes ne sont pas imposés si usage habitation
  const taxableBase = input.propertyType === "rental"
    ? cadastralIncome * 1.4
    : cadastralIncome;

  // Précompte immobilier : ~1.25% du RC indexé * 12.5 (centimes additionnels)
  const propertyTax = cadastralIncome * 0.125 * 12.5 / 100 * 100; // simplified
  const effectivePropertyTax = input.propertyValue * 0.008;

  // Income tax: Belgian progressive rates on taxable base
  const belgianTaxRate = (income: number): number => {
    if (income <= 15200) return income * 0.25;
    if (income <= 26830) return 3800 + (income - 15200) * 0.40;
    if (income <= 46440) return 8452 + (income - 26830) * 0.45;
    return 17276 + (income - 46440) * 0.50;
  };

  const incomeTax = belgianTaxRate(taxableBase);
  const socialCharges = 0; // No separate social charges in Belgium (included in tax)

  // Capital gains on private property: generally exempt after 5 years
  const capitalGain = Math.max(0, input.propertyValue * 0.20);
  const capitalGainsTax = input.ownershipYears < 5 && input.propertyType !== "primary"
    ? capitalGain * 0.165 // 16.5% for short-term
    : 0;

  const totalTax = incomeTax + effectivePropertyTax + capitalGainsTax;
  const totalInvestment = input.propertyValue + acquisitionCosts;
  const effectiveRate = (totalTax / totalInvestment) * 100;
  const grossYield = input.propertyValue > 0 ? (rentalIncome / input.propertyValue) * 100 : 0;
  const netYield = ((rentalIncome - incomeTax - effectivePropertyTax) / totalInvestment) * 100;
  const netReturn = rentalIncome - incomeTax - effectivePropertyTax;

  const breakdown: TaxBreakdown[] = [
    { label: "Revenu cadastral imposable", amount: Math.round(taxableBase) },
    { label: "Impôt sur le revenu (RC × 1,4)", amount: Math.round(incomeTax) },
    { label: "Précompte immobilier", amount: Math.round(effectivePropertyTax), rate: 0.8 },
    { label: "Plus-value immobilière", amount: Math.round(capitalGainsTax), note: input.ownershipYears >= 5 ? "Exonérée > 5 ans" : "Taxée < 5 ans" },
    { label: "Droits d'enregistrement", amount: Math.round(acquisitionCosts), rate: 12.5 },
  ];

  const keyPoints = [
    `Revenu cadastral indexé : ${Math.round(cadastralIncome).toLocaleString("fr-FR")} €`,
    "Loyers réels non imposés pour les locations à usage d'habitation",
    input.ownershipYears >= 5 ? "Plus-value exonérée (> 5 ans de détention)" : `Plus-value taxée à 16,5% (${input.ownershipYears} ans < 5 ans)`,
    "Pas d'IFI en Belgique",
  ];

  const warnings = [
    "Les droits d'enregistrement varient : 12,5% en Wallonie, 10% en Flandre, 12,5% à Bruxelles",
    "Le taux d'abattement pour résidence principale peut réduire les droits",
    input.propertyType === "commercial" ? "La location de locaux professionnels est imposée sur les loyers réels" : "",
  ].filter(Boolean);

  const recommendations = [
    "Profiter de l'abattement sur la résidence principale en Wallonie (jusqu'à 20 000 € de RC exonéré)",
    "Structurer l'investissement via une société pour optimiser l'imposition des loyers",
    "Vérifier l'éligibilité au chèque-habitat flamand ou wallon",
  ];

  return {
    country: "BE",
    countryName: "Belgique",
    taxableBase: Math.round(taxableBase),
    incomeTax: Math.round(incomeTax),
    socialCharges,
    capitalGainsTax: Math.round(capitalGainsTax),
    propertyTax: Math.round(effectivePropertyTax),
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
