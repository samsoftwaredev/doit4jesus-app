import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CountryFlagBadge } from "@/components/ui";
import { theme } from "@/theme/tokens";

import { getCountries } from "./onboarding.api";
import type { Country } from "./onboarding.types";

type CountrySelectorProps = {
  onSelect: (country: Country) => void;
  selectedCode: string | null;
  selectedName: string | null;
};

export function CountrySelector({ onSelect, selectedCode, selectedName }: CountrySelectorProps) {
  const activeQueryRef = useRef("");
  const requestControllerRef = useRef<AbortController | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nextQuery = query.trim();
    activeQueryRef.current = nextQuery;
    requestControllerRef.current?.abort();
    setIsLoading(false);
    const timeout = setTimeout(() => setSearch(nextQuery), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    requestControllerRef.current = controller;
    activeQueryRef.current = search;
    setCountries([]);
    setError(null);
    setHasMore(false);
    setIsLoading(true);
    setNextOffset(null);

    void getCountries({ limit: 20, offset: 0, q: search || undefined }, controller.signal)
      .then((page) => {
        if (controller.signal.aborted || activeQueryRef.current !== search) return;
        setCountries(page.countries);
        setHasMore(page.meta.hasMore);
        setNextOffset(page.meta.nextOffset);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "We couldn't load countries.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
      if (requestControllerRef.current === controller) requestControllerRef.current = null;
    };
  }, [search, visible]);

  const loadMore = async () => {
    if (!hasMore || nextOffset === null || isLoading || isLoadingMore) return;
    const requestedQuery = activeQueryRef.current;
    setIsLoadingMore(true);
    try {
      const page = await getCountries({ limit: 20, offset: nextOffset, q: requestedQuery || undefined });
      if (activeQueryRef.current !== requestedQuery) return;
      setCountries((current) => [
        ...current,
        ...page.countries.filter((country) => !current.some((c) => c.code === country.code)),
      ]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch {
      setError("We couldn't load more countries. Try again.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const dismiss = () => {
    setVisible(false);
    setQuery("");
    setSearch("");
  };

  return (
    <>
      <Pressable
        accessibilityLabel={`Country, ${selectedName ?? "not selected"}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: visible }}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
      >
        <View style={styles.flagWrap}>
          {selectedCode ? (
            <CountryFlagBadge countryCode={selectedCode} size={28} />
          ) : (
            <Feather color={theme.colors.icon.muted} name="globe" size={28} />
          )}
        </View>
        <View style={styles.selectedCopy}>
          <Text style={styles.fieldLabel}>Country</Text>
          <Text numberOfLines={1} style={[styles.selectedName, !selectedName && styles.placeholder]}>
            {selectedName ?? "Select a country"}
          </Text>
        </View>
        <Feather color={theme.colors.icon.secondary} name="chevron-down" size={theme.sizes.iconMedium} />
      </Pressable>

      <Modal animationType="slide" onRequestClose={dismiss} transparent visible={visible}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>
                Select your country
              </Text>
              <Pressable
                accessibilityLabel="Close country selector"
                accessibilityRole="button"
                onPress={dismiss}
                style={styles.closeButton}
              >
                <Feather color={theme.colors.icon.primary} name="x" size={theme.sizes.iconMedium} />
              </Pressable>
            </View>
            <View style={styles.searchWrap}>
              <Feather color={theme.colors.icon.muted} name="search" size={theme.sizes.iconSmall} />
              <TextInput
                accessibilityLabel="Search countries"
                autoCapitalize="words"
                onChangeText={setQuery}
                placeholder="Search by country or code"
                placeholderTextColor={theme.colors.text.subtle}
                style={styles.searchInput}
                value={query}
              />
              {isLoading ? <ActivityIndicator color={theme.colors.brand.primaryLight} size="small" /> : null}
            </View>
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <FlatList
              contentContainerStyle={styles.list}
              data={countries}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(country) => country.code}
              ListEmptyComponent={!isLoading ? <Text style={styles.empty}>No countries found.</Text> : null}
              ListFooterComponent={isLoadingMore ? <ActivityIndicator color={theme.colors.brand.primaryLight} /> : null}
              onEndReached={() => void loadMore()}
              onEndReachedThreshold={0.3}
              renderItem={({ item }) => {
                const selected = item.code === selectedCode;
                return (
                  <Pressable
                    accessibilityLabel={item.name}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onSelect(item);
                      dismiss();
                    }}
                    style={({ pressed }) => [
                      styles.result,
                      selected && styles.selectedResult,
                      pressed && styles.pressed,
                    ]}
                  >
                    <CountryFlagBadge countryCode={item.code} size={24} />
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.countryCode}>{item.code}</Text>
                    {selected ? (
                      <Feather color={theme.colors.text.success} name="check" size={theme.sizes.iconSmall} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  countryCode: { ...theme.typography.labelSmall, color: theme.colors.text.muted },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    paddingVertical: theme.spacing[6],
    textAlign: "center",
  },
  error: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.danger,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
  },
  fieldLabel: { ...theme.typography.labelSmall, color: theme.colors.text.muted },
  flagWrap: { alignItems: "center", justifyContent: "center", width: theme.spacing[10] },
  list: { padding: theme.spacing[4] },
  modalBackdrop: { backgroundColor: theme.colors.background.overlay, flex: 1, justifyContent: "flex-end" },
  placeholder: { color: theme.colors.text.subtle },
  pressed: { opacity: theme.opacity.pressed },
  result: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: 58,
    paddingHorizontal: theme.spacing[2],
  },
  resultName: { ...theme.typography.bodyMedium, color: theme.colors.text.primary, flex: 1 },
  searchInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    flex: 1,
    minHeight: theme.sizes.touchTarget,
  },
  searchWrap: {
    alignItems: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    paddingHorizontal: theme.spacing[3],
  },
  selectedCopy: { flex: 1, gap: theme.spacing[0.5], minWidth: 0 },
  selectedName: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  selectedResult: { backgroundColor: theme.colors.surface.green },
  selector: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: 76,
    padding: theme.spacing[3],
  },
  sheet: {
    alignSelf: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.strong,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    maxHeight: "88%",
    maxWidth: 640,
    minHeight: "60%",
    width: "100%",
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  sheetTitle: { ...theme.typography.heading3, color: theme.colors.text.primary },
});
