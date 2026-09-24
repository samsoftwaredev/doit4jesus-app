/* eslint-disable @typescript-eslint/no-require-imports -- Jest mock factories load React Native primitives lazily. */
import { render, screen } from "@testing-library/react-native";

import { PrayerIntentionAvatar } from "./PrayerIntentionAvatar";

// AvatarWithCountryBadge uses Image and flag assets; keep it simple
jest.mock("@/components/identity", () => ({
  AvatarWithCountryBadge: ({ accessibilityLabel }: { accessibilityLabel: string }) => {
    const { View } = require("react-native");
    return <View accessibilityLabel={accessibilityLabel} />;
  },
}));

describe("PrayerIntentionAvatar", () => {
  it("renders with the correct accessibility label", async () => {
    await render(<PrayerIntentionAvatar displayName="Maria Santos" countryCode="MX" />);
    expect(screen.getByLabelText("Maria Santos's avatar")).toBeTruthy();
  });

  it("renders without a country code", async () => {
    await render(<PrayerIntentionAvatar displayName="Anonymous" />);
    expect(screen.getByLabelText("Anonymous's avatar")).toBeTruthy();
  });

  it("renders with a source URL", async () => {
    await render(<PrayerIntentionAvatar displayName="John Paul" source="https://example.com/avatar.png" />);
    expect(screen.getByLabelText("John Paul's avatar")).toBeTruthy();
  });
});
