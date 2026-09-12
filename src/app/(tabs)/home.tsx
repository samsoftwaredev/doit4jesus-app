import { useRouter } from "expo-router";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup } from "@/components/ui";
import { HolyProgressDashboard } from "@/features/dashboard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      actions={
        <HeaderActionGroup
          onMessagesPress={() => router.push("/messages")}
          onNotificationsPress={() => router.push("/notifications")}
          onSettingsPress={() => router.push("/settings")}
        />
      }
      description="Grow in faith, compete in holiness."
      showLogo
      title="Welcome home"
    >
      <HolyProgressDashboard />
    </ScreenShell>
  );
}
