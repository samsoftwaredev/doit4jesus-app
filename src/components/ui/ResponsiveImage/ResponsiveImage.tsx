import { useEffect, useState } from "react";
import { Image as ExpoImage } from "expo-image";
import { useWindowDimensions } from "react-native";

import { theme } from "@/theme/tokens";

import type {
  ResponsiveImageProps,
  ResponsiveImageSource,
} from "./ResponsiveImage.types";

function selectImageSource({
  width,
  mobileSource,
  tabletSource,
  desktopSource,
}: {
  width: number;
  mobileSource: ResponsiveImageSource;
  tabletSource?: ResponsiveImageSource;
  desktopSource?: ResponsiveImageSource;
}): ResponsiveImageSource {
  if (width >= theme.breakpoints.desktop) {
    return desktopSource ?? tabletSource ?? mobileSource;
  }

  if (width >= theme.breakpoints.tablet) {
    return tabletSource ?? desktopSource ?? mobileSource;
  }

  return mobileSource;
}

export function ResponsiveImage({
  mobileSource,
  tabletSource,
  desktopSource,
  preserveAspectRatio = false,
  style,
  onLoad,
  ...imageProps
}: ResponsiveImageProps) {
  const { width } = useWindowDimensions();
  const source = selectImageSource({
    width,
    mobileSource,
    tabletSource,
    desktopSource,
  });
  const [aspectRatio, setAspectRatio] = useState<number>();

  useEffect(() => {
    setAspectRatio(undefined);
  }, [source]);

  function handleLoad(event: Parameters<NonNullable<ResponsiveImageProps["onLoad"]>>[0]) {
    const { height, width: imageWidth } = event.source;

    if (preserveAspectRatio && imageWidth > 0 && height > 0) {
      setAspectRatio(imageWidth / height);
    }

    onLoad?.(event);
  }

  return (
    <ExpoImage
      {...imageProps}
      onLoad={handleLoad}
      source={source}
      style={[preserveAspectRatio && aspectRatio ? { aspectRatio } : undefined, style]}
    />
  );
}
