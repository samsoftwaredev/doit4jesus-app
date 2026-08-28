import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { CurrentUserProfile } from "./profile.types";
import { ProfileProvider, useCurrentProfile } from "./profile-provider";

const mockFetchProfile = jest.fn();
const mockUseAuth = jest.fn();

jest.mock("@/features/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("./profile.api", () => ({
  fetchCurrentUserProfile: (...args: unknown[]) => mockFetchProfile(...args),
}));

const profile = {
  profileSetup: { complete: false, completedAt: null, missingFields: ["city"], nextStep: "city" },
  userId: "user-1",
} as CurrentUserProfile;

describe("ProfileProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isPasswordRecovery: false,
      session: { user: { id: "user-1" } },
    });
  });

  it("keeps authenticated profile access loading until GET /api/v1/me resolves", async () => {
    let resolveProfile: (value: CurrentUserProfile) => void = () => undefined;
    mockFetchProfile.mockImplementation(
      () =>
        new Promise<CurrentUserProfile>((resolve) => {
          resolveProfile = resolve;
        }),
    );
    const { result } = await renderHook(() => useCurrentProfile(), {
      wrapper: ({ children }) => <ProfileProvider>{children}</ProfileProvider>,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.profile).toBeNull();

    await act(async () => resolveProfile(profile));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.profile?.profileSetup.nextStep).toBe("city");
  });

  it("keeps protected content unavailable after a profile load failure and supports retry", async () => {
    mockFetchProfile.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(profile);
    const { result } = await renderHook(() => useCurrentProfile(), {
      wrapper: ({ children }) => <ProfileProvider>{children}</ProfileProvider>,
    });

    await waitFor(() => expect(result.current.error).toBe("offline"));
    expect(result.current.profile).toBeNull();

    await act(async () => result.current.refreshProfile());
    expect(result.current.profile).toBe(profile);
    expect(result.current.error).toBeNull();
  });
});
