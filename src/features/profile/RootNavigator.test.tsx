import { fireEvent, render } from "@testing-library/react-native";

import { RootNavigator } from "@/app/_layout";

const mockRefreshProfile = jest.fn();

jest.mock("@/features/auth", () => ({
  useAuth: () => ({ isLoading: false, isPasswordRecovery: false, session: { user: { id: "user-1" } } }),
}));

jest.mock("@/features/profile", () => ({
  getProfileAccessState: () => "error",
  useCurrentProfile: () => ({ isLoading: false, refreshProfile: mockRefreshProfile }),
}));

describe("Root navigator profile error", () => {
  beforeEach(() => {
    mockRefreshProfile.mockReset();
  });

  it("centers the recovery button and retries profile loading", async () => {
    const { getByRole, getByText } = await render(<RootNavigator />);

    expect(getByText("We couldn't load your profile.")).toBeTruthy();
    expect(getByText("Check your connection and try again. Your dashboard remains protected.")).toBeTruthy();
    const retryButton = getByRole("button", { name: "Try Again" });
    expect(retryButton).toHaveStyle({ alignSelf: "center" });

    fireEvent.press(retryButton);
    expect(mockRefreshProfile).toHaveBeenCalledTimes(1);
  });
});
