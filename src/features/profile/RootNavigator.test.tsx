import { fireEvent, render } from "@testing-library/react-native";

import { RootNavigator } from "@/app/_layout";
import { i18n } from "@/localization";

const mockRefreshProfile = jest.fn();
const mockSignOut = jest.fn();
let mockAuthState = {
  isLoading: false,
  isPasswordRecovery: false,
  session: { user: { id: "user-1" } } as { user: { id: string } } | null,
};
let mockProfileAccessState: "complete" | "error" | "onboarding" = "error";

jest.mock("expo-router", () => {
  const React = jest.requireActual("react");

  const Stack = Object.assign(
    ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    {
      Protected: ({ children, guard }: { children: React.ReactNode; guard: boolean }) =>
        guard ? React.createElement(React.Fragment, null, children) : null,
      Screen: () => null,
    },
  );

  return {
    DarkTheme: { colors: {} },
    DefaultTheme: { colors: {} },
    Stack,
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("@/features/auth", () => ({
  useAuth: () => mockAuthState,
}));

jest.mock("@/features/profile", () => ({
  getProfileAccessState: () => mockProfileAccessState,
  useCurrentProfile: () => ({ isLoading: false, refreshProfile: mockRefreshProfile }),
}));

jest.mock("@/features/background-music", () => {
  const React = jest.requireActual("react");
  const { Text, View } = jest.requireActual("react-native");

  return {
    BackgroundMusicProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: "background-music-provider" }, children),
    BackgroundMusicSideDrawerHandle: () => React.createElement(Text, null, "Background music drawer"),
  };
});

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
    mockAuthState = {
      isLoading: false,
      isPasswordRecovery: false,
      session: { user: { id: "user-1" } },
    };
    mockProfileAccessState = "error";
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

  it("mounts background music only for the complete signed-in app", async () => {
    mockProfileAccessState = "complete";
    const rendered = await render(<RootNavigator />);

    expect(rendered.getByTestId("background-music-provider")).toBeTruthy();
    expect(rendered.getByText("Background music drawer")).toBeTruthy();

    mockAuthState = { ...mockAuthState, session: null };
    await rendered.rerender(<RootNavigator />);
    expect(rendered.queryByTestId("background-music-provider")).toBeNull();

    mockAuthState = { ...mockAuthState, isPasswordRecovery: true, session: { user: { id: "user-1" } } };
    await rendered.rerender(<RootNavigator />);
    expect(rendered.queryByTestId("background-music-provider")).toBeNull();

    mockAuthState = { ...mockAuthState, isPasswordRecovery: false };
    mockProfileAccessState = "onboarding";
    await rendered.rerender(<RootNavigator />);
    expect(rendered.queryByTestId("background-music-provider")).toBeNull();
  });
});
