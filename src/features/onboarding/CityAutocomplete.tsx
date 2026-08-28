import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "@/theme/tokens";

import { getCities } from "./onboarding.api";
import type { City } from "./onboarding.types";

export type CitySelection = Pick<City, "countryCode" | "id" | "name" | "regionName">;

type CityAutocompleteProps = {
  countryCode: string;
  countryName: string | null;
  onSelect: (city: CitySelection | null) => void;
  selectedCity: CitySelection | null;
};

export function CityAutocomplete({ countryCode, countryName, onSelect, selectedCity }: CityAutocompleteProps) {
  const activeQueryRef = useRef("");
  const hasSelectedCity = Boolean(selectedCity);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(selectedCity?.name ?? "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setQuery(selectedCity?.name ?? "");
  }, [selectedCity?.id, selectedCity?.name]);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(query.trim()), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (query.trim() !== search || search.length < 2 || hasSelectedCity) {
      activeQueryRef.current = search;
      setCities([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    activeQueryRef.current = search;
    setError(null);
    setIsLoading(true);

    void getCities({ countryCode, limit: 20, offset: 0, q: search }, controller.signal)
      .then((page) => {
        if (controller.signal.aborted || activeQueryRef.current !== search) return;
        setCities(page.cities);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setCities([]);
        setError(requestError instanceof Error ? requestError.message : "We couldn't search for cities.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [countryCode, hasSelectedCity, query, search]);

  const changeQuery = (value: string) => {
    setQuery(value);
    if (selectedCity && value !== selectedCity.name) onSelect(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>City</Text>
      <View style={[styles.inputWrap, selectedCity && styles.selectedInput]}>
        <Feather color={theme.colors.icon.muted} name="map-pin" size={theme.sizes.iconSmall} />
        <TextInput
          accessibilityLabel="City"
          autoCapitalize="words"
          onChangeText={changeQuery}
          placeholder="e.g. Los Angeles"
          placeholderTextColor={theme.colors.text.subtle}
          style={styles.input}
          value={query}
        />
        {isLoading ? <ActivityIndicator color={theme.colors.brand.primaryLight} size="small" /> : null}
        {selectedCity ? (
          <Feather color={theme.colors.text.success} name="check-circle" size={theme.sizes.iconSmall} />
        ) : null}
      </View>
      {query.trim().length === 1 ? <Text style={styles.helper}>Type at least 2 characters.</Text> : null}
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      {cities.length > 0 ? (
        <View accessibilityLabel="City search results" style={styles.results}>
          {cities.map((city) => {
            const selected = selectedCity?.id === city.id;
            const location = [city.regionName, countryName ?? city.countryCode].filter(Boolean).join(", ");
            return (
              <Pressable
                accessibilityLabel={`${city.name}${location ? `, ${location}` : ""}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={city.id}
                onPress={() => {
                  onSelect(city);
                  setQuery(city.name);
                  setCities([]);
                }}
                style={({ pressed }) => [styles.result, selected && styles.selectedResult, pressed && styles.pressed]}
              >
                <View style={styles.resultCopy}>
                  <Text style={styles.cityName}>{city.name}</Text>
                  {location ? <Text style={styles.region}>{location}</Text> : null}
                </View>
                {selected ? (
                  <Feather color={theme.colors.text.success} name="check" size={theme.sizes.iconSmall} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {!isLoading && search.length >= 2 && cities.length === 0 && !selectedCity && !error ? (
        <Text style={styles.helper}>No matching cities found.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cityName: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  container: { gap: theme.spacing[1.5] },
  error: { ...theme.typography.bodySmall, color: theme.colors.text.danger },
  helper: { ...theme.typography.caption, color: theme.colors.text.muted },
  input: { ...theme.typography.body, color: theme.colors.text.primary, flex: 1, minHeight: theme.sizes.touchTarget },
  inputWrap: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
  },
  label: { ...theme.typography.label, color: theme.colors.text.secondary },
  pressed: { opacity: theme.opacity.pressed },
  region: { ...theme.typography.caption, color: theme.colors.text.muted, marginTop: theme.spacing[0.5] },
  result: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    minHeight: 58,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  resultCopy: { flex: 1 },
  results: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    maxHeight: 260,
    overflow: "hidden",
  },
  selectedInput: { borderColor: theme.colors.semantic.successBorder },
  selectedResult: { backgroundColor: theme.colors.surface.green },
});
