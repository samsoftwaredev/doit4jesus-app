import { HeaderActionButton } from "./HeaderActionButton";
import type { UnreadHeaderActionProps } from "./HeaderActionGroup.types";

export function MessageAction(props: UnreadHeaderActionProps) {
  return <HeaderActionButton {...props} iconName="mail" label="Messages" />;
}
