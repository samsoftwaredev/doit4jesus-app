import { Platform, Share } from "react-native";
import { captureRef } from "react-native-view-shot";
import type { RefObject } from "react";
import type { View } from "react-native";
import * as Sharing from "expo-sharing";

import { logDevelopmentError } from "@/lib/development-logger";

import { SHARE_IMAGE_SIZE } from "./RosaryShareImage";

/**
 * Renders the off-screen share poster to a PNG and opens the system share sheet with it.
 * iOS attaches the caption alongside the picture; Android shares the picture itself. If image capture or file
 * sharing is unavailable, falls back to sharing the caption text so the user can always post something.
 */
export async function shareRosaryAchievement(imageRef: RefObject<View | null>, caption: string, dialogTitle: string) {
  try {
    const uri = await captureRef(imageRef, {
      format: "png",
      height: SHARE_IMAGE_SIZE.height * 3,
      quality: 1,
      result: "tmpfile",
      width: SHARE_IMAGE_SIZE.width * 3,
    });

    if (Platform.OS === "ios") {
      await Share.share({ message: caption, url: uri });
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { dialogTitle, mimeType: "image/png", UTI: "public.png" });
      return;
    }
  } catch (error) {
    logDevelopmentError("sharing a Rosary achievement image", error);
  }

  try {
    await Share.share({ message: caption });
  } catch (error) {
    logDevelopmentError("sharing a Rosary achievement", error);
  }
}
