import { fireEvent, render } from "@testing-library/react-native";

import { RootNavigator } from "@/app/_layout";
import { i18n } from "@/localization";

const mockRefreshProfile = jest.fn();
const mockSignOut = jest.fn();

jest.mock("@/features/auth", () => ({
  useAuth: () => ({ isLoading: false, isPasswordRecovery: false, session: { user: { id: "user-1" } } }),
}));

jest.mock("@/features/profile", () => ({
  getProfileAccessState: () => "error",
  useCurrentProfile: () => ({ isLoading: false, refreshProfile: mockRefreshProfile }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  },
}));

describe("Root navigator profile error", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    mockRefreshProfile.mockReset();
    mockSignOut.mockReset();
    mockSignOut.mockResolvedValue({ error: null });
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows retry and sign-out actions side by side and runs each recovery action", async () => {
    const { getByRole, getByText } = await render(<RootNavigator />);

    expect(getByText("We couldn't load your profile.")).toBeTruthy();
    expect(getByText("Check your connection and try again. Your dashboard remains protected.")).toBeTruthy();
    const retryButton = getByRole("button", { name: "Try Again" });
    const signOutButton = getByRole("button", { name: "Sign Out" });
    expect(retryButton.parent).toBe(signOutButton.parent);
    expect(retryButton.parent).toHaveStyle({ flexDirection: "row" });

    await fireEvent.press(retryButton);
    await fireEvent.press(signOutButton);
    expect(mockRefreshProfile).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("shows the profile recovery actions in Spanish", async () => {
    await i18n.changeLanguage("es");
    const { getByRole } = await render(<RootNavigator />);

    expect(getByRole("button", { name: "Intentar de nuevo" })).toBeTruthy();
    expect(getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
  });
});
