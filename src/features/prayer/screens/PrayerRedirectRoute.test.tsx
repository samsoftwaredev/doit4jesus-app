import { render } from "@testing-library/react-native";

import PrayerRoute from "@/app/(tabs)/prayer";

const mockRedirect = jest.fn<null, [{ href: string }]>(() => null);

jest.mock("expo-router", () => ({
  Redirect: (props: { href: string }) => mockRedirect(props),
}));

describe("PrayerRoute", () => {
  it("redirects legacy Prayer links to Home", async () => {
    await render(<PrayerRoute />);

    expect(mockRedirect).toHaveBeenCalledWith({ href: "/home" });
  });
});
