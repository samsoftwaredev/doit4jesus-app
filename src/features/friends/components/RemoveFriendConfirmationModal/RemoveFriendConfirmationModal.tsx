import { Modal, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button, Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

export interface RemoveFriendConfirmationModalProps {
  error?: boolean;
  friendName: string;
  isRemoving: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  visible: boolean;
}

/** Presents an accessible destructive confirmation while preventing duplicate removal requests. */
export function RemoveFriendConfirmationModal({
  error = false,
  friendName,
  isRemoving,
  onConfirm,
  onDismiss,
  visible,
}: RemoveFriendConfirmationModalProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  /** Ignores platform dismissal while the destructive request is in progress. */
  const handleRequestClose = () => {
    if (!isRemoving) onDismiss();
  };

  return (
    <Modal animationType="fade" onRequestClose={handleRequestClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialogContainer}>
          <Card padding="md" style={styles.dialog} variant="elevated">
            <Text accessibilityRole="header" style={styles.title}>
              {t("friends.profile.removeTitle")}
            </Text>
            <Text style={styles.description}>{t("friends.profile.removeDescription", { name: friendName })}</Text>
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {t("friends.profile.removeError")}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Button disabled={isRemoving} onPress={onDismiss} variant="ghost">
                {t("common.cancel")}
              </Button>
              <Button loading={isRemoving} onPress={onConfirm} variant="danger">
                {t("friends.profile.remove")}
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    justifyContent: "flex-end",
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  dialog: {
    gap: theme.spacing[4],
    width: "100%",
  },
  dialogContainer: {
    maxWidth: 520,
    width: "100%",
  },
  error: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.danger,
    textAlign: "center",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  title: {
    ...theme.typography.heading3,
    textAlign: "center",
  },
}));
