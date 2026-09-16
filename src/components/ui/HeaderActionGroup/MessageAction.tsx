import { useTranslation } from "react-i18next";

import { HeaderActionButton } from "./HeaderActionButton";
import type { UnreadHeaderActionProps } from "./HeaderActionGroup.types";

export function MessageAction(props: UnreadHeaderActionProps) {
  const { t } = useTranslation();
  return <HeaderActionButton {...props} iconName="mail" label={t("headerActions.messages")} />;
}
