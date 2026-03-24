import { SimulationInput, SimulationResult, TaxBreakdown } from "./types";

export function calculateLU(input: SimulationInput): SimulationResult {
  const acquisitionCosts = input.propertyValue * 0.065;
  const rentalIncome = input.propertyType === "rental" ? input.annualRentalIncome : 0;
  const deductibleCharges = rentalIncome * 0.25;
  const netRentalIncome = rentalIncome - deductibleCharges;

  const luTax = (income: number): number => {
    if (income <= 11265) return 0;
    if (income <= 13173) return (income - 11265) * 0.08;
    if (income <= 15081) return 152 + (income - 13173) * 0.10;
    if (income <= 16989) return 343 + (income - 15081) * 0.12;
    if (income <= 18897) return 572 + (income - 16989) * 0.14;
    if (income <= 20805) return 839 + (income - 18897) * 0.16;
    if (income <= 22713) return 1144 + (income - 20805) * 0.18;
    if (income <= 24621) return 1487 + (income - 22713) * 0.20;
    if (income <= 26529) return 1869 + (income - 24621) * 0.22;
    if (income <= 28437) return 2289 + (income - 26529) * 0.24;
    if (income <= 30345) return 2747 + (income - 28437) * 0.26;
    if (income <= 32253) return 3243 + (income - 30345) * 0.28;
    if (income <= 34161) return 3777 + (income - 32253) * 0.30;
    if (income <= 36069) return 4349 + (income - 34161) * 0.32;
    if (income <= 37977) return 4960 + (income - 36069) * 0.34;
    if (income <= 39885) return 5609 + (income - 37977) * 0.36;
    if (income <= 41793) return 6296 + (income - 39885) * 0.38;
    if (income <= 100000) return 7021 + (income - 41793) * 0.39;
    return 29722 + (income - 100000) * 0.42;
  };

  const incomeTax = luTax(netRentalIncome);
  const socialCharges = netRentalIncome * 0.11; // ~11% social contributions

  const capitalGain = Math.max(0, input.propertyValue * 0.20);
  const capitalGainsTax = input.ownershipYears >= 2
    ? (capitalGain * 0.5) * 0.39
    : capitalGain * 0.39;

  const propertyTax = input.propertyValue * 0.005;
  const totalTax = incomeTax + socialCharges + capitalGainsTax + propertyTax;
  const totalInvestment = input.propertyValue + acquisitionCosts;
  const effectiveRate = (totalTax / totalInvestment) * 100;
  const grossYield = input.propertyValue > 0 ? (rentalIncome / input.propertyValue) * 100 : 0;
  const netYield = ((rentalIncome - incomeTax - socialCharges - propertyTax) / totalInvestment) * 100;
  const netReturn = rentalIncome - incomeTax - socialCharges - propertyTax;

  const breakdown: TaxBreakdown[] = [
    { label: "Impôt sur le revenu locatif", amount: Math.round(incomeTax) },
    { label: "Cotisations sociales (~11%)", amount: Math.round(socialCharges), rate: 11 },
    { label: "Plus-value immobilière", amount: Math.round(capitalGainsTax), note: input.ownershipYears >= 2 ? "Abattement 50% (> 2 ans)" : "Plein tarif" },
    { label: "Impôt foncier", amount: Math.round(propertyTax), rate: 0.5 },
    { label: "Droits d'enregistrement", amount: Math.round(acquisitionCosts), rate: 6.5 },
  ];

  return {
    country: "LU", countryName: "Luxembourg",
    taxableBase: Math.round(netRentalIncome), incomeTax: Math.round(incomeTax),
    socialCharges: Math.round(socialCharges), capitalGainsTax: Math.round(capitalGainsTax),
    propertyTax: Math.round(propertyTax), acquisitionCosts: Math.round(acquisitionCosts),
    totalTax: Math.round(totalTax), effectiveRate: Math.round(effectiveRate * 10) / 10,
    grossYield: Math.round(grossYield * 100) / 100, netYield: Math.round(netYield * 100) / 100,
    netReturn: Math.round(netReturn), breakdown,
    keyPoints: [
      "Abattement de 50% sur les plus-values après 2 ans de détention",
      `Rendement brut : ${grossYield.toFixed(2)}%`,
      "Déduction forfaitaire de 25% sur les charges locatives",
      "Fiscalité attractive pour les investisseurs non-résidents",
    ],
    warnings: [
      "Les non-résidents sont imposés uniquement sur les revenus luxembourgeois",
      "Vérifier les conventions fiscales bilatérales avec votre pays de résidence",
    ],
    recommendations: [
      "L'abattement de 50% sur les plus-values après 2 ans est très avantageux",
      "Optimiser via une société de gestion patrimoniale (SOPARFI)",
      "Envisager l'amortissement accéléré pour les biens locatifs",
    ],
  };
}
