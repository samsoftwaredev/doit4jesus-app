import flags from "@/data/flags.json";

import type { Country } from "./onboarding.types";

type FlagMetadata = {
  countryCode: string;
  countryName: string;
  flagLocation: string;
};

const flagMetadata = flags as Record<string, FlagMetadata>;

export const countriesWithFlags: readonly Country[] = Object.values(flagMetadata)
  .map(({ countryCode, countryName }) => ({
    code: countryCode.toUpperCase(),
    latitude: null,
    longitude: null,
    name: countryName,
  }))
  .sort((first, second) => first.name.localeCompare(second.name));

export function filterCountriesWithFlags(query: string): Country[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [...countriesWithFlags];

  return countriesWithFlags.filter((country) =>
    `${country.name} ${country.code}`.toLocaleLowerCase().includes(normalizedQuery),
  );
}
