import { HeaderActionButton } from "./HeaderActionButton";
import type { UnreadHeaderActionProps } from "./HeaderActionGroup.types";

export function NotificationAction(props: UnreadHeaderActionProps) {
  return <HeaderActionButton {...props} iconName="bell" label="Notifications" />;
}
