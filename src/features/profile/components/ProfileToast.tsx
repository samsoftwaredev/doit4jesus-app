import Feather from "@expo/vector-icons/Feather";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type ProfileToastProps = {
  message?: string;
  onDismiss: () => void;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function ProfileToast({ message, onDismiss }: ProfileToastProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(onDismiss, 3600);
    return () => clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.toast}>
      <Feather
        accessible={false}
        color={theme.colors.semantic.success}
        name="check-circle"
        size={theme.sizes.iconSmall}
      />
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityLabel={t("common.dismissMessage")}
        accessibilityRole="button"
        hitSlop={theme.spacing[2]}
        onPress={onDismiss}
        style={styles.dismiss}
      >
        <Feather accessible={false} color={theme.colors.text.secondary} name="x" size={theme.sizes.iconSmall} />
      </Pressable>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  dismiss: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    marginRight: -theme.spacing[2],
    width: theme.sizes.touchTarget,
  },
  message: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.primary,
    flex: 1,
    marginLeft: theme.spacing[2],
  },
  toast: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.successSurface,
    borderColor: theme.colors.semantic.successBorder,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    marginBottom: theme.spacing[4],
    paddingLeft: theme.spacing[3],
  },
}));
