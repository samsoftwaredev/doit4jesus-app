import { AvatarWithCountryBadge } from "@/components/identity";

import { theme } from "@/theme/tokens";

type FriendAvatarProps = {
  accessibilityLabel: string;
  countryCode?: string | null;
  name: string;
  size?: "lg" | "md" | "sm" | "xl";
  source: string | null;
};

const sizeByVariant = {
  lg: theme.sizes.iconLarge,
  md: theme.sizes.iconMedium + theme.spacing[2],
  sm: theme.sizes.iconMedium,
  xl: theme.sizes.iconHero + theme.spacing[8],
} as const;

export function FriendAvatar({ accessibilityLabel, countryCode, name, size = "md", source }: FriendAvatarProps) {
  const avatarSize = sizeByVariant[size];

  return (
    <AvatarWithCountryBadge
      accessibilityLabel={accessibilityLabel}
      countryCode={countryCode}
      name={name}
      size={avatarSize}
      source={source}
    />
  );
}
