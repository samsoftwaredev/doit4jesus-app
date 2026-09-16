import { useCallback, useEffect, useState } from "react";
import { Alert, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { ArmorDetailCard } from "./ArmorDetailCard";
import { ArmorHeader } from "./ArmorHeader";
import { ArmorItemCard } from "./ArmorItemCard";
import { ArmorProgress } from "./ArmorProgress";
import { ArmorSelector } from "./ArmorSelector";
import { KnightDisplay } from "./KnightDisplay";
import { StickyActionBar } from "./StickyActionBar";
import { getArmorItems } from "./armorOfGod.data";
import type { ArmorItem } from "./armorOfGod.types";
import { isArmorEquipped } from "./armorOfGod.utils";

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorOfGodScreen() {
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<readonly ArmorItem[]>(() => getArmorItems(language));
  const [selectedId, setSelectedId] = useState(() => getArmorItems(language)[0].id);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const equippedCount = items.filter((item) => isArmorEquipped(item.status)).length;
  const isDesktop = width >= theme.breakpoints.desktop;
  const isTablet = width >= theme.breakpoints.tablet;

  useEffect(() => {
    setItems((currentItems) =>
      getArmorItems(language).map((localizedItem) => ({
        ...localizedItem,
        status: currentItems.find((item) => item.id === localizedItem.id)?.status ?? localizedItem.status,
      })),
    );
  }, [language]);

  const handleArmorAction = useCallback(() => {
    if (selectedItem.status === "available") {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === selectedItem.id ? { ...item, status: "equipped" } : item)),
      );
      return;
    }

    if (selectedItem.status === "completed" && selectedItem.challenge) {
      Alert.alert(selectedItem.name, selectedItem.challenge);
    }
  }, [selectedItem]);

  const handleReadScripture = useCallback(() => {
    Alert.alert(t("armor.readTitle"), t("armor.readAlert"));
  }, [t]);

  if (!selectedItem) {
    return null;
  }

  const actionDisabled = selectedItem.status === "equipped" || selectedItem.status === "locked";
  const actionLabel =
    selectedItem.status === "available"
      ? t("armor.action.equip", { item: selectedItem.shortName.toUpperCase() })
      : selectedItem.status === "completed"
        ? t("armor.action.viewChallenge")
        : selectedItem.status === "equipped"
          ? t("armor.action.equipped")
          : t("armor.action.locked");

  return (
    <View style={styles.section}>
      <ArmorHeader />

      {isDesktop ? (
        <>
          <View style={styles.desktopLayout}>
            <View style={styles.sideColumn}>
              {items.slice(0, 3).map((item) => (
                <ArmorItemCard
                  item={item}
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  selected={item.id === selectedId}
                />
              ))}
            </View>

            <View style={styles.centerColumn}>
              <KnightDisplay selectedItem={selectedItem} />
              <ArmorProgress equippedCount={equippedCount} totalCount={items.length} />
            </View>

            <View style={styles.sideColumn}>
              {items.slice(3).map((item) => (
                <ArmorItemCard
                  item={item}
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  selected={item.id === selectedId}
                />
              ))}
            </View>
          </View>
          <View style={styles.detailContainer}>
            <ArmorDetailCard item={selectedItem} onAction={handleArmorAction} />
          </View>
        </>
      ) : isTablet ? (
        <>
          <KnightDisplay selectedItem={selectedItem} />
          <ArmorProgress equippedCount={equippedCount} totalCount={items.length} />
          <View style={styles.tabletGrid}>
            {items.map((item) => (
              <ArmorItemCard
                item={item}
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                selected={item.id === selectedId}
                style={styles.tabletItem}
              />
            ))}
          </View>
          <View style={styles.detailContainer}>
            <ArmorDetailCard item={selectedItem} onAction={handleArmorAction} />
          </View>
        </>
      ) : (
        <>
          <KnightDisplay selectedItem={selectedItem} />
          <ArmorProgress equippedCount={equippedCount} totalCount={items.length} />
          <ArmorSelector items={items} onSelect={setSelectedId} selectedId={selectedId} />
          <ArmorDetailCard item={selectedItem} onAction={handleArmorAction} />
          <StickyActionBar
            actionDisabled={actionDisabled}
            actionLabel={actionLabel}
            onAction={handleArmorAction}
            onReadScripture={handleReadScripture}
          />
        </>
      )}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  section: {
    marginTop: theme.spacing[10],
  },
  desktopLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[4],
    marginTop: theme.spacing[6],
  },
  sideColumn: {
    flex: 1,
    gap: theme.spacing[4],
    minWidth: theme.spacing[0],
  },
  centerColumn: {
    flex: 1.2,
    minWidth: theme.spacing[0],
  },
  tabletGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    marginTop: theme.spacing[5],
  },
  tabletItem: {
    flexBasis: "47%",
    flexGrow: 1,
  },
  detailContainer: {
    marginTop: theme.spacing[5],
  },
}));
