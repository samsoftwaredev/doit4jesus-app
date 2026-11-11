import { Stack } from "expo-router";

import { ChurchReminderSetupProvider } from "@/features/churches/components";

/** Keeps chosen-church drafts alive across church discovery. */
export default function ChurchesLayout() {
  return (
    <ChurchReminderSetupProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ChurchReminderSetupProvider>
  );
}
