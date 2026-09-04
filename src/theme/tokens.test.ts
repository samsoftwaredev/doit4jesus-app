import { darkTheme, lightTheme, theme } from "@/theme/tokens";

function luminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function leafPaths(value: object, prefix = ""): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === "object" && child !== null ? leafPaths(child, path) : path;
  });
}

describe("theme token contract", () => {
  it("defines the responsive acceptance boundaries and expanded desktop rail width", () => {
    expect(theme.breakpoints.tablet).toBe(768);
    expect(theme.breakpoints.desktop).toBe(1024);
    expect(theme.sizes.sidebarWidth).toBe(240);
    expect(theme.sizes.touchTarget).toBeGreaterThanOrEqual(44);
  });

  it("keeps identical semantic keys in both palettes", () => {
    expect(leafPaths(lightTheme.colors)).toEqual(leafPaths(darkTheme.colors));
    expect(leafPaths(lightTheme.rosary.colors)).toEqual(leafPaths(darkTheme.rosary.colors));
  });

  it.each([
    ["primary text", lightTheme.colors.text.primary, lightTheme.colors.background.primary],
    ["secondary text", lightTheme.colors.text.secondary, lightTheme.colors.background.primary],
    ["link text", lightTheme.colors.text.link, lightTheme.colors.background.primary],
    ["success feedback", lightTheme.colors.text.success, lightTheme.colors.semantic.successSurface],
    ["danger feedback", lightTheme.colors.text.danger, lightTheme.colors.semantic.dangerSurface],
    ["info feedback", lightTheme.colors.text.info, lightTheme.colors.semantic.infoSurface],
    ["primary control", lightTheme.colors.text.white, lightTheme.colors.brand.primary],
    ["secondary control", lightTheme.colors.text.white, lightTheme.colors.accent.blue],
    ["danger control", lightTheme.colors.text.white, lightTheme.colors.semantic.danger],
    ["warning control", lightTheme.colors.text.inverse, lightTheme.colors.semantic.warning],
  ])("meets WCAG AA contrast for %s", (_label, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
