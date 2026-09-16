import { useTranslation } from "react-i18next";

import { HeaderActionButton } from "./HeaderActionButton";
import type { UnreadHeaderActionProps } from "./HeaderActionGroup.types";

export function NotificationAction(props: UnreadHeaderActionProps) {
  const { t } = useTranslation();
  return <HeaderActionButton {...props} iconName="bell" label={t("headerActions.notifications")} />;
}
