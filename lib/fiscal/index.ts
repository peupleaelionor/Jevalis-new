import { SimulationInput, SimulationResult } from "./types";
import { calculateFR } from "./fr";
import { calculateCH } from "./ch";
import { calculateBE } from "./be";
import { calculateLU } from "./lu";
import { calculateNL } from "./nl";
import { calculateDE } from "./de";

export type { SimulationInput, SimulationResult, TaxBreakdown, CountryInfo } from "./types";
export { COUNTRIES } from "./types";

const calculators: Record<string, (input: SimulationInput) => SimulationResult> = {
  FR: calculateFR,
  CH: calculateCH,
  BE: calculateBE,
  LU: calculateLU,
  NL: calculateNL,
  DE: calculateDE,
};

export function calculateFiscal(input: SimulationInput): SimulationResult {
  const calculator = calculators[input.country];
  if (!calculator) {
    throw new Error(`Unsupported country: ${input.country}`);
  }
  return calculator(input);
}

export function getSupportedCountries(): string[] {
  return Object.keys(calculators);
}
