import { HeaderActionButton } from "./HeaderActionButton";
import type { HeaderActionProps } from "./HeaderActionGroup.types";

export function SettingsAction(props: HeaderActionProps) {
  return <HeaderActionButton {...props} iconName="settings" label="Settings" />;
}
