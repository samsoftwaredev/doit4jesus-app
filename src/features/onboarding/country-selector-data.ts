import flags from "@/data/flags.json";

import type { Country } from "./onboarding.types";

type FlagMetadata = {
  countryCode: string;
  countryName: string;
  flagLocation: string;
};

const flagMetadata = flags as Record<string, FlagMetadata>;

const countriesAlphabetically: readonly Country[] = Object.values(flagMetadata)
  .map(({ countryCode, countryName }) => ({
    code: countryCode.toUpperCase(),
    latitude: null,
    longitude: null,
    name: countryName,
  }))
  .sort((first, second) => first.name.localeCompare(second.name));

export const countriesWithFlags: readonly Country[] = [
  ...countriesAlphabetically.filter((country) => country.code === "US"),
  ...countriesAlphabetically.filter((country) => country.code !== "US"),
];

/**
 * Returns the pinned default catalog for an empty query or alphabetical matching countries for a search.
 *
 * @param query User-entered country name or code search term.
 * @returns Countries that match the query without promoting the United States within search results.
 */
export function filterCountriesWithFlags(query: string): Country[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [...countriesWithFlags];

  return countriesAlphabetically.filter((country) =>
    `${country.name} ${country.code}`.toLocaleLowerCase().includes(normalizedQuery),
  );
}
