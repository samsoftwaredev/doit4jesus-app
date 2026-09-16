import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup } from "@/components/ui";
import { HolyProgressDashboard } from "@/features/dashboard";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenShell
      actions={
        <HeaderActionGroup
          onMessagesPress={() => router.push("/messages")}
          onNotificationsPress={() => router.push("/notifications")}
          onSettingsPress={() => router.push("/settings")}
        />
      }
      description={t("home.description")}
      showLogo
      title={t("home.title")}
    >
      <HolyProgressDashboard />
    </ScreenShell>
  );
}
