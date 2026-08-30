import { useRouter } from "expo-router";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup } from "@/components/ui";
import { HolyProgressDashboard } from "@/features/dashboard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      title="Welcome home"
      subtitle="Grow in faith, compete in holiness."
      headerAccessory={
        <HeaderActionGroup
          onMessagesPress={() => router.push("/messages")}
          onNotificationsPress={() => router.push("/notifications")}
          onSettingsPress={() => router.push("/settings")}
        />
      }
    >
      <HolyProgressDashboard />
    </ScreenShell>
  );
}
