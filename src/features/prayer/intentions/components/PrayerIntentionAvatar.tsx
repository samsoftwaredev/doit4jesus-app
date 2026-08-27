import { AvatarWithCountryBadge } from "@/components/identity";

import { theme } from "@/theme/tokens";

type PrayerIntentionAvatarProps = {
  countryCode?: string | null;
  displayName: string;
  size?: number;
  source?: string | null;
};

const defaultAvatar = require("../../../../assets/avatar/knight.png");

export function PrayerIntentionAvatar({ countryCode, displayName, size = 38, source }: PrayerIntentionAvatarProps) {
  return (
    <AvatarWithCountryBadge
      accessibilityLabel={`${displayName}'s avatar`}
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
