import { SimulationInput, SimulationResult, TaxBreakdown } from "./types";

export function calculateDE(input: SimulationInput): SimulationResult {
  const transferTaxRate = 0.05; // ~5% Grunderwerbsteuer average
  const acquisitionCosts = input.propertyValue * (transferTaxRate + 0.015 + 0.01); // transfer + notary + agent
  const rentalIncome = input.propertyType === "rental" ? input.annualRentalIncome : 0;

  // AfA (depreciation) deduction
  const afaRate = input.ownershipYears >= 1 ? 0.02 : 0; // 2% per year
  const afaDeduction = input.propertyValue * 0.8 * afaRate; // 80% of value is depreciable
  const netRentalIncome = Math.max(0, rentalIncome - afaDeduction - rentalIncome * 0.20);

  // German progressive income tax
  const deTax = (income: number): number => {
    if (income <= 11604) return 0;
    if (income <= 17005) {
      const y = (income - 11604) / 10000;
      return (979.18 * y + 1400) * y;
    }
    if (income <= 66760) {
      const z = (income - 17005) / 10000;
      return (192.59 * z + 2397) * z + 966;
    }
    if (income <= 277826) return income * 0.42 - 10602;
    return income * 0.45 - 18936;
  };

  const solidaritySurcharge = (tax: number) => tax > 18130 ? tax * 0.055 : 0;

  const incomeTaxBase = deTax(input.otherIncome + netRentalIncome) - deTax(input.otherIncome);
  const soli = solidaritySurcharge(incomeTaxBase);
  const incomeTax = incomeTaxBase + soli;
  const socialCharges = 0;

  // Capital gains: exempt after 10 years (Spekulationsfrist)
  const capitalGain = Math.max(0, input.propertyValue * 0.22);
  const capitalGainsTax = input.ownershipYears < 10 && input.propertyType !== "primary"
    ? deTax(input.otherIncome + capitalGain) - deTax(input.otherIncome)
    : 0;

  const propertyTax = input.propertyValue * 0.005; // Grundsteuer ~0.5%

  const totalTax = incomeTax + capitalGainsTax + propertyTax;
  const totalInvestment = input.propertyValue + acquisitionCosts;
  const effectiveRate = (totalTax / totalInvestment) * 100;
  const grossYield = input.propertyValue > 0 ? (rentalIncome / input.propertyValue) * 100 : 0;
  const netYield = ((rentalIncome - incomeTax - propertyTax) / totalInvestment) * 100;
  const netReturn = rentalIncome - incomeTax - propertyTax;

  const breakdown: TaxBreakdown[] = [
    { label: "Impôt sur le revenu locatif net", amount: Math.round(incomeTax) },
    { label: `AfA (amortissement ${(afaRate * 100).toFixed(0)}%/an)`, amount: -Math.round(afaDeduction), note: "Déductible" },
    { label: "Surtaxe de solidarité (5,5%)", amount: Math.round(soli) },
    { label: `Plus-value (${input.ownershipYears} ans)`, amount: Math.round(capitalGainsTax), note: input.ownershipYears >= 10 ? "Exonérée > 10 ans" : `Imposée < 10 ans` },
    { label: "Grundsteuer (taxe foncière)", amount: Math.round(propertyTax), rate: 0.5 },
    { label: "Frais d'acquisition (Nebenkosten)", amount: Math.round(acquisitionCosts), rate: (transferTaxRate + 0.025) * 100 },
  ];

  return {
    country: "DE", countryName: "Allemagne",
    taxableBase: Math.round(netRentalIncome), incomeTax: Math.round(incomeTax),
    socialCharges, capitalGainsTax: Math.round(capitalGainsTax),
    propertyTax: Math.round(propertyTax), acquisitionCosts: Math.round(acquisitionCosts),
    totalTax: Math.round(totalTax), effectiveRate: Math.round(effectiveRate * 10) / 10,
    grossYield: Math.round(grossYield * 100) / 100, netYield: Math.round(netYield * 100) / 100,
    netReturn: Math.round(netReturn), breakdown,
    keyPoints: [
      `AfA (amortissement) : ${(afaRate * 100).toFixed(0)}%/an sur 80% de la valeur`,
      `Plus-value ${input.ownershipYears >= 10 ? "EXONÉRÉE" : "imposée"} (${input.ownershipYears} ans / seuil 10 ans)`,
      "Surtaxe de solidarité : 5,5% sur l'impôt au-delà d'un seuil",
      `Grunderwerbsteuer : ~5% selon le Land`,
    ],
    warnings: [
      "Les Nebenkosten (frais annexes) en Allemagne sont parmi les plus élevés d'Europe",
      input.ownershipYears < 10 ? "⚠ Vente avant 10 ans : plus-value totalement imposable" : "",
      "La réforme de la Grundsteuer est en cours — les taux communaux varient fortement",
    ].filter(Boolean),
    recommendations: [
      "Conserver le bien au moins 10 ans pour bénéficier de l'exonération totale",
      "Maximiser les déductions : AfA, intérêts, frais de gestion, rénovations",
      "Envisager le régime GmbH pour les portefeuilles importants (IS à 15% + soli)",
    ],
  };
}
