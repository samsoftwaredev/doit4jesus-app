import Feather from "@expo/vector-icons/Feather";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { ChurchSummary } from "../../churches.types";

export type SelectedChurchesModalProps = {
  churches: readonly ChurchSummary[];
  errorMessage: string | null;
  maxChurches: number;
  onClose: () => void;
  onRemove: (church: ChurchSummary) => void;
  /** Churches whose removal request is still in flight. */
  pendingChurchIds: ReadonlySet<string>;
  visible: boolean;
};

/** Builds one readable address line without exposing blank optional fields. */
function formatChurchAddress(church: ChurchSummary): string {
  return [church.addressLine1, church.addressLine2, church.city, church.regionName, church.postalCode]
    .filter(Boolean)
    .join(", ");
}

/** Lists the followed churches; removing one saves immediately. */
export function SelectedChurchesModal({
  churches,
  errorMessage,
  maxChurches,
  onClose,
  onRemove,
  pendingChurchIds,
  visible,
}: SelectedChurchesModalProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel={t("common.close")}
          accessibilityRole="button"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View accessibilityViewIsModal style={styles.sheet} testID="selected-churches-sheet">
          <Text accessibilityRole="header" style={styles.title}>
            {t("churches.selected.title")}
          </Text>
          <Text style={styles.muted}>
            {t("churches.results.selectedCount", { count: churches.length, max: maxChurches })}
          </Text>
          <ScrollView contentContainerStyle={styles.list} style={styles.scroll}>
            {churches.length === 0 ? <Text style={styles.empty}>{t("churches.selected.empty")}</Text> : null}
            {churches.map((church) => (
              <View key={church.id} style={styles.row}>
                <View style={styles.rowCopy}>
                  <Text style={styles.name}>{church.name}</Text>
                  <Text style={styles.muted}>{formatChurchAddress(church)}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`${t("churches.results.remove")} ${church.name}`}
                  accessibilityRole="button"
                  disabled={pendingChurchIds.has(church.id)}
                  hitSlop={theme.spacing[2]}
                  onPress={() => onRemove(church)}
                  style={styles.removeButton}
                >
                  <Feather accessible={false} color={theme.colors.semantic.danger} name="trash-2" size={20} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
          {errorMessage ? (
            <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.error}>
              {errorMessage}
            </Text>
          ) : null}
          <Button fullWidth onPress={onClose} variant="outline">
            {t("common.close")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  backdrop: { flex: 1 },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    padding: theme.spacing[4],
    textAlign: "center",
  },
  error: { ...theme.typography.bodySmall, color: theme.colors.semantic.danger },
  list: { gap: theme.spacing[1] },
  muted: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  name: { ...theme.typography.body, color: theme.colors.text.primary, fontWeight: "700" },
  overlay: { backgroundColor: theme.colors.background.overlay, flex: 1, justifyContent: "flex-end" },
  removeButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  row: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
    paddingVertical: theme.spacing[2],
  },
  rowCopy: { flex: 1, gap: theme.spacing[1], minWidth: 0 },
  scroll: { flexGrow: 0 },
  sheet: {
    alignSelf: "center",
    backgroundColor: theme.colors.surface.primary,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    gap: theme.spacing[3],
    maxHeight: "85%",
    maxWidth: 640,
    padding: theme.spacing[4],
    width: "100%",
  },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary },
}));
