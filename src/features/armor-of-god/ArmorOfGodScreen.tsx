import { useCallback, useState } from "react";
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native";

import { theme } from "@/theme/tokens";

import { ArmorDetailCard } from "./ArmorDetailCard";
import { ArmorHeader } from "./ArmorHeader";
import { ArmorItemCard } from "./ArmorItemCard";
import { ArmorProgress } from "./ArmorProgress";
import { ArmorSelector } from "./ArmorSelector";
import { KnightDisplay } from "./KnightDisplay";
import { StickyActionBar } from "./StickyActionBar";
import { armorItems } from "./armorOfGod.data";
import type { ArmorItem } from "./armorOfGod.types";
import { getArmorActionLabel, isArmorEquipped } from "./armorOfGod.utils";

export function ArmorOfGodScreen() {
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<ReadonlyArray<ArmorItem>>(armorItems);
  const [selectedId, setSelectedId] = useState(armorItems[0].id);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const equippedCount = items.filter((item) => isArmorEquipped(item.status)).length;
  const isDesktop = width >= theme.breakpoints.desktop;
  const isTablet = width >= theme.breakpoints.tablet;

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
    Alert.alert("Ephesians 6", "Read Ephesians 6:10–18 to reflect on the full armor of God.");
  }, []);

  if (!selectedItem) {
    return null;
  }

  const actionDisabled = selectedItem.status === "equipped" || selectedItem.status === "locked";

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
            actionLabel={getArmorActionLabel(selectedItem.status, selectedItem.shortName)}
            onAction={handleArmorAction}
            onReadScripture={handleReadScripture}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
