import { SimulationInput, SimulationResult, TaxBreakdown } from "./types";

export function calculateNL(input: SimulationInput): SimulationResult {
  const isInvestment = input.propertyType !== "primary";
  const acquisitionCosts = input.propertyValue * (isInvestment ? 0.104 : 0.02);
  const rentalIncome = input.propertyType === "rental" ? input.annualRentalIncome : 0;

  // Box 3: deemed return on net assets
  const thresholdFree = 57000;
  const taxableWealth = Math.max(0, input.propertyValue - thresholdFree);
  const deemedReturn = taxableWealth > 0 ? taxableWealth * 0.0636 : 0;
  const box3Tax = deemedReturn * 0.36;

  // Box 1: mortgage interest deduction (if primary)
  const mortgageInterest = input.propertyType === "primary" ? input.propertyValue * 0.035 * 0.6 : 0;
  const box1Deduction = mortgageInterest * 0.495;

  const incomeTax = isInvestment ? box3Tax : Math.max(0, box3Tax - box1Deduction);
  const socialCharges = 0;

  // Capital gains: exempt for primary residence; Box 3 for investment
  const capitalGainsTax = 0; // No direct capital gains tax in NL (absorbed in Box 3)

  const propertyTax = input.propertyValue * 0.003; // OZB gemeentelijk

  const totalTax = incomeTax + propertyTax;
  const totalInvestment = input.propertyValue + acquisitionCosts;
  const effectiveRate = (totalTax / totalInvestment) * 100;
  const grossYield = input.propertyValue > 0 ? (rentalIncome / input.propertyValue) * 100 : 0;
  const netYield = ((rentalIncome - incomeTax - propertyTax) / totalInvestment) * 100;
  const netReturn = rentalIncome - incomeTax - propertyTax;

  const breakdown: TaxBreakdown[] = [
    { label: "Box 3 (rendement fictif 6,36%)", amount: Math.round(box3Tax), rate: 36, note: "Sur patrimoine net > 57 000 €" },
    { label: "Déduction intérêts hypothécaires", amount: -Math.round(box1Deduction), note: "Box 1 (résidence principale)" },
    { label: "OZB (taxe communale)", amount: Math.round(propertyTax), rate: 0.3 },
    { label: "Plus-value immobilière", amount: 0, note: "Pas d'impôt direct sur plus-value" },
    { label: "Droits de mutation (overdrachtsbelasting)", amount: Math.round(acquisitionCosts), rate: isInvestment ? 10.4 : 2 },
  ];

  return {
    country: "NL", countryName: "Pays-Bas",
    taxableBase: Math.round(taxableWealth), incomeTax: Math.round(incomeTax),
    socialCharges, capitalGainsTax,
    propertyTax: Math.round(propertyTax), acquisitionCosts: Math.round(acquisitionCosts),
    totalTax: Math.round(totalTax), effectiveRate: Math.round(effectiveRate * 10) / 10,
    grossYield: Math.round(grossYield * 100) / 100, netYield: Math.round(netYield * 100) / 100,
    netReturn: Math.round(netReturn), breakdown,
    keyPoints: [
      `Box 3 : imposition sur rendement fictif de 6,36% du patrimoine net`,
      `Droits de mutation : ${isInvestment ? "10,4%" : "2%"} pour ${isInvestment ? "un investissement" : "une résidence principale"}`,
      "Pas d'impôt sur les plus-values immobilières à proprement parler",
      "Seuil d'exonération Box 3 : 57 000 €/personne",
    ],
    warnings: [
      "Le système Box 3 est en cours de réforme suite à un arrêt de la Cour suprême",
      "Les taux de droits de mutation (10,4%) pour investissement sont très élevés",
      isInvestment ? "Attention : 10,4% de droits de mutation pour les biens d'investissement depuis 2023" : "",
    ].filter(Boolean),
    recommendations: [
      "Envisager la structure en BV (société) pour les portefeuilles > 3 biens",
      "Surveiller les évolutions du régime Box 3 (en transition vers imposition réelle)",
      "Préférer les biens en résidence principale pour les droits de mutation réduits",
    ],
  };
}
