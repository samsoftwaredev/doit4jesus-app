import { Platform } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

/** Converts a #rgb/#rrggbb color plus opacity to an rgba() string; other formats pass through unchanged. */
function withOpacity(color: string, opacity: number): string {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
  if (!match) return color;
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Builds a `boxShadow` style from the legacy shadow vocabulary (color, opacity, offset, radius).
 * A legacy shadow radius corresponds to roughly half of a CSS blur radius, hence the doubling.
 */
export function boxShadow(color: string, opacity: number, y: number, radius: number, x = 0): ViewStyle {
  return { boxShadow: `${x}px ${y}px ${radius * 2}px ${withOpacity(color, opacity)}` };
}

/** Text shadow: web uses the `textShadow` string, native keeps the legacy props (no native string support). */
export function textShadow(color: string, y: number, radius: number, x = 0): TextStyle {
  return Platform.OS === "web"
    ? ({ textShadow: `${x}px ${y}px ${radius}px ${color}` } as TextStyle)
    : { textShadowColor: color, textShadowOffset: { height: y, width: x }, textShadowRadius: radius };
}
