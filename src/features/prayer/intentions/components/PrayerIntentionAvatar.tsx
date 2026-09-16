import { AvatarWithCountryBadge } from "@/components/identity";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/theme/AppThemeProvider";
import { theme } from "@/theme/tokens";

type PrayerIntentionAvatarProps = {
  countryCode?: string | null;
  displayName: string;
  size?: number;
  source?: string | null;
};

const defaultAvatar = require("../../../../assets/avatar/knight.png");

/** Renders this feature with colors from the currently resolved app appearance. */
export function PrayerIntentionAvatar({ countryCode, displayName, size = 38, source }: PrayerIntentionAvatarProps) {
  useAppTheme();
  const { t } = useTranslation();
  return (
    <AvatarWithCountryBadge
      accessibilityLabel={t("intentions.avatarLabel", { name: displayName })}
      borderColor={theme.rosary.colors.gold}
      borderWidth={theme.rosary.borderWidths.gold}
      countryCode={countryCode}
      fallbackSource={defaultAvatar}
      flagSize={Math.max(12, Math.round(size * 0.35))}
      name={displayName}
      size={size}
      source={source}
    />
  );
}
