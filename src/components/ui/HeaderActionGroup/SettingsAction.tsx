import { useTranslation } from "react-i18next";

import { HeaderActionButton } from "./HeaderActionButton";
import type { HeaderActionProps } from "./HeaderActionGroup.types";

export function SettingsAction(props: HeaderActionProps) {
  const { t } = useTranslation();
  return <HeaderActionButton {...props} iconName="settings" label={t("headerActions.settings")} />;
}
