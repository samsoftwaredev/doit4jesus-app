import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui";

import { styles } from "./StickyActionBar.styles";

interface StickyActionBarProps {
  actionDisabled: boolean;
  actionLabel: string;
  onAction: () => void;
  onReadScripture: () => void;
}

export function StickyActionBar({ actionDisabled, actionLabel, onAction, onReadScripture }: StickyActionBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.actions}>
        <Button disabled={actionDisabled} fullWidth onPress={onAction} variant="warning">
          {actionLabel}
        </Button>
        <Button fullWidth onPress={onReadScripture} variant="ghost">
          READ EPHESIANS 6
        </Button>
      </View>
    </SafeAreaView>
  );
}
