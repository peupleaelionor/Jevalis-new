import { SimulationInput, SimulationResult, TaxBreakdown } from "./types";

/** French progressive income tax brackets 2024 */
function frIncomeTax(income: number, isMarried: boolean): number {
  const quotient = isMarried ? income / 2 : income;
  let tax = 0;

  if (quotient <= 11294) tax = 0;
  else if (quotient <= 28797) tax = (quotient - 11294) * 0.11;
  else if (quotient <= 82341) tax = 17503 * 0.11 + (quotient - 28797) * 0.30;
  else if (quotient <= 177106) tax = 17503 * 0.11 + 53544 * 0.30 + (quotient - 82341) * 0.41;
  else tax = 17503 * 0.11 + 53544 * 0.30 + 94765 * 0.41 + (quotient - 177106) * 0.45;

  return isMarried ? tax * 2 : tax;
}

/** Capital gains abatement for duration (IR) */
function frCapitalGainsAbatement(years: number): number {
  if (years < 6) return 0;
  if (years < 22) return (years - 5) * 0.06;
  return 1.0; // 100% exempt after 22 years
}

/** Capital gains abatement for social charges */
function frSocialAbatement(years: number): number {
  if (years < 6) return 0;
  if (years < 22) return (years - 5) * 0.0165;
  if (years < 30) return 0.891 + (years - 21) * 0.09;
  return 1.0;
}

export function calculateFR(input: SimulationInput): SimulationResult {
  const isMarried = input.filingStatus === "married" || input.filingStatus === "pacsed";
  const acquisitionCosts = input.propertyValue * 0.08; // ~8% frais notaire

  // Income tax on rental income
  const rentalIncome = input.propertyType === "rental" ? input.annualRentalIncome : 0;
  const deductibleCharges = rentalIncome * 0.30; // micro-foncier 30% abatement
  const netRentalIncome = rentalIncome - deductibleCharges;

  const totalIncome = input.otherIncome + netRentalIncome;
  const incomeTaxBase = frIncomeTax(totalIncome, isMarried);
  const incomeTaxOnRental = rentalIncome > 0
    ? frIncomeTax(input.otherIncome + netRentalIncome, isMarried) - frIncomeTax(input.otherIncome, isMarried)
    : 0;

  // Social charges on rental income
  const socialCharges = netRentalIncome * 0.172;

  // Capital gains tax
  const capitalGain = Math.max(0, input.propertyValue * 0.25); // estimated 25% appreciation
  const irAbatement = frCapitalGainsAbatement(input.ownershipYears);
  const psAbatement = frSocialAbatement(input.ownershipYears);
  const taxableCapitalGain = capitalGain * (1 - irAbatement);
  const capitalGainsTax = input.propertyType !== "primary"
    ? taxableCapitalGain * 0.19 + capitalGain * (1 - psAbatement) * 0.172
    : 0;

  // Property tax (taxe foncière) — estimated
  const propertyTax = input.propertyValue * 0.006;

  // IFI check
  const ifiNote = input.propertyValue > 1_300_000 && isMarried === false
    ? "Attention : IFI potentiellement applicable au-delà de 1,3 M€"
    : input.propertyValue > 2_600_000 && isMarried
    ? "Attention : IFI potentiellement applicable"
    : undefined;

  const totalTax = incomeTaxOnRental + socialCharges + capitalGainsTax + propertyTax;
  const totalInvestment = input.propertyValue + acquisitionCosts;
  const effectiveRate = totalInvestment > 0 ? (totalTax / totalInvestment) * 100 : 0;
  const grossYield = input.propertyValue > 0 ? (rentalIncome / input.propertyValue) * 100 : 0;
  const netYield = input.propertyValue > 0 ? ((rentalIncome - socialCharges - incomeTaxOnRental - propertyTax) / totalInvestment) * 100 : 0;
  const netReturn = rentalIncome - socialCharges - incomeTaxOnRental - propertyTax;

  const breakdown: TaxBreakdown[] = [
    { label: "Impôt sur le revenu locatif", amount: Math.round(incomeTaxOnRental), rate: incomeTaxOnRental / netRentalIncome * 100 },
    { label: "Prélèvements sociaux (17,2%)", amount: Math.round(socialCharges), rate: 17.2 },
    { label: "Plus-value immobilière", amount: Math.round(capitalGainsTax), note: irAbatement === 1 ? "Exonéré" : undefined },
    { label: "Taxe foncière (estimée)", amount: Math.round(propertyTax), rate: 0.6 },
    { label: "Frais d'acquisition", amount: Math.round(acquisitionCosts), rate: 8, note: "Non déductibles" },
  ];

  const keyPoints = [
    `Revenu locatif annuel net après charges : ${Math.round(netReturn).toLocaleString("fr-FR")} €`,
    `Rendement brut : ${grossYield.toFixed(2)}%`,
    `Rendement net après impôts : ${netYield.toFixed(2)}%`,
    input.ownershipYears >= 22
      ? "Plus-value totalement exonérée d'IR après 22 ans de détention"
      : `Abattement plus-value IR : ${(irAbatement * 100).toFixed(0)}% après ${input.ownershipYears} ans`,
  ];

  const warnings: string[] = [
    ...(ifiNote ? [ifiNote] : []),
    rentalIncome > 15_000
      ? "Au-delà de 15 000 €/an, le régime réel est souvent plus avantageux que le micro-foncier"
      : "",
    input.propertyType === "commercial"
      ? "Les locaux commerciaux peuvent être soumis à la TVA — consultez un expert-comptable"
      : "",
  ].filter(Boolean);

  const recommendations = [
    "Envisager le régime réel pour déduire les charges et intérêts d'emprunt",
    "Vérifier l'éligibilité aux dispositifs Pinel, Denormandie ou Loc'Avantages",
    "Consulter un notaire pour optimiser la transmission du patrimoine",
  ];

  return {
    country: "FR",
    countryName: "France",
    taxableBase: Math.round(netRentalIncome),
    incomeTax: Math.round(incomeTaxOnRental),
    socialCharges: Math.round(socialCharges),
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
