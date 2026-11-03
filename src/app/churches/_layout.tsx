import { Stack } from "expo-router";

import { ChurchReminderSetupProvider } from "@/features/churches/components";

/** Keeps reminder drafts alive while users move between church discovery and review. */
export default function ChurchesLayout() {
  return (
    <ChurchReminderSetupProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ChurchReminderSetupProvider>
  );
}
