import type { LiturgicalColor } from "./liturgy.types";

export interface LiturgicalThemeTokens {
  accent: string;
  border: string;
  glow: string;
  label: string;
}

export const liturgicalTheme: Record<LiturgicalColor, LiturgicalThemeTokens> = {
  BLACK: {
    accent: "#B5C0C7",
    border: "#657783",
    glow: "rgba(157, 174, 183, 0.16)",
    label: "#D4DEE3",
  },
  GREEN: {
    accent: "#77C98B",
    border: "#3F855C",
    glow: "rgba(91, 177, 112, 0.18)",
    label: "#94D7A3",
  },
  RED: {
    accent: "#E17A7A",
    border: "#9B4D58",
    glow: "rgba(198, 82, 95, 0.18)",
    label: "#EDA0A0",
  },
  ROSE: {
    accent: "#EAA1AD",
    border: "#A55D70",
    glow: "rgba(215, 120, 140, 0.18)",
    label: "#F2BBC4",
  },
  VIOLET: {
    accent: "#B198D7",
    border: "#715A9C",
    glow: "rgba(132, 99, 185, 0.2)",
    label: "#C6B4E5",
  },
  WHITE: {
    accent: "#F1C46A",
    border: "#B99858",
    glow: "rgba(241, 196, 106, 0.16)",
    label: "#F6D891",
  },
};
