import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Alert, Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { CurrentUserProfile } from "@/features/profile";
import { ProfileSettingsScreen } from "@/features/profile/ProfileSettingsScreen";

const mockPush = jest.fn();
const mockFetchProfile = jest.fn();
const mockUpdateProfile = jest.fn();
const mockDeleteProfile = jest.fn();
const mockSignOut = jest.fn();
const safeAreaMetrics = {
  frame: { height: 844, width: 390, x: 0, y: 0 },
  insets: { bottom: 0, left: 0, right: 0, top: 0 },
};

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/auth", () => ({
  useAuth: () => ({ configurationError: null }),
}));

jest.mock("@/features/profile", () => ({
  deleteCurrentUserProfile: (...args: unknown[]) => mockDeleteProfile(...args),
  fetchCurrentUserProfile: (...args: unknown[]) => mockFetchProfile(...args),
  updateCurrentUserProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  },
}));

const profile: CurrentUserProfile = {
  avatarUrl: "https://example.com/avatar.png",
  cityId: "city-austin",
  cityName: "Austin",
  countryCode: "US",
  countryName: "United States",
  createdAt: "2026-08-22T15:28:02.335433+00:00",
  displayName: "Test User",
  gender: "male",
  leaderboardVisibility: "public",
  preferredLanguage: "en",
  profileSetup: { complete: true, completedAt: "2026-08-22T15:28:02.335433+00:00", missingFields: [], nextStep: null },
  prayerMapVisibility: "aggregated",
  saintAvatarId: null,
  state: "Texas",
  timezone: "America/Chicago",
  title: "Faithful Beginner",
  updatedAt: "2026-08-22T15:28:02.335433+00:00",
  userId: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
  username: "testuser",
};

async function renderProfile() {
  mockFetchProfile.mockResolvedValue(profile);
  await render(
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <ProfileSettingsScreen />
    </SafeAreaProvider>,
  );
  await screen.findAllByText("Test User");
}

describe("Profile settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchProfile.mockReset();
    mockUpdateProfile.mockReset();
    mockDeleteProfile.mockResolvedValue(undefined);
    mockSignOut.mockResolvedValue({ error: null });
  });

  it("renders the API profile, location, account controls, and no deferred preferences", async () => {
    await renderProfile();

    expect(screen.getByText("Profile & Settings")).toBeTruthy();
    expect(screen.getAllByText("Austin, Texas, USA")).toHaveLength(2);
    expect(screen.getByLabelText("Gender, Male")).toBeTruthy();
    expect(screen.getByText("Contact Support")).toBeTruthy();
    expect(screen.getByText("Privacy Policy")).toBeTruthy();
    expect(screen.getByText("Terms of Service")).toBeTruthy();
    expect(screen.getByText("App Version")).toBeTruthy();
    expect(screen.getByText("Sign Out")).toBeTruthy();
    expect(screen.getByText("Delete Account")).toBeTruthy();
    expect(screen.queryByText("PREFERENCES")).toBeNull();
  });

  it("edits only the display name", async () => {
    mockUpdateProfile.mockResolvedValue({ ...profile, displayName: "Samuel Ruiz" });
    await renderProfile();

    await fireEvent.press(screen.getByLabelText("Name, Test User"));
    expect(await screen.findByText("Edit Name")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Display name"), "Samuel Ruiz");
    await fireEvent.press(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({ displayName: "Samuel Ruiz" });
    });
    expect(await screen.findAllByText("Samuel Ruiz")).toHaveLength(2);
  });

  it("changes gender through the selection sheet", async () => {
    mockUpdateProfile.mockResolvedValue({ ...profile, gender: "female" });
    await renderProfile();

    await fireEvent.press(screen.getByLabelText("Gender, Male"));
    expect(await screen.findByLabelText("Female")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Female"));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({ gender: "female" });
    });
    expect(await screen.findByLabelText("Gender, Female")).toBeTruthy();
  });

  it("opens the local saint selector and saves the selected saint UUID", async () => {
    const saintAvatarId = "a1000000-0000-4000-8000-000000000002";
    mockUpdateProfile.mockResolvedValue({ ...profile, saintAvatarId });
    await renderProfile();

    await fireEvent.press(screen.getAllByLabelText("Change profile avatar")[1]);
    expect(await screen.findByText("Choose Your Saint")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("St. Joseph"));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({ saintAvatarId });
    });
  });

  it("opens support, legal, and about destinations", async () => {
    const openUrl = jest.spyOn(Linking, "openURL").mockResolvedValue(true as never);
    await renderProfile();

    await fireEvent.press(screen.getByText("Contact Support"));
    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith("mailto:samuel@inripaintwall.com?subject=Do%20It%20for%20Jesus%20Support");
    });

    await fireEvent.press(screen.getByText("Privacy Policy"));
    await fireEvent.press(screen.getByText("Terms of Service"));
    expect(openUrl).toHaveBeenCalledWith("https://www.doitforjesus.com/privacy-policy");
    expect(openUrl).toHaveBeenCalledWith("https://www.doitforjesus.com/terms-of-service");

    await fireEvent.press(screen.getByText("About Us"));
    expect(mockPush).toHaveBeenCalledWith("/about");
    openUrl.mockRestore();
  });

  it("signs out and prevents duplicate requests", async () => {
    await renderProfile();

    await fireEvent.press(screen.getByText("Sign Out"));
    await fireEvent.press(screen.getByText("Sign Out"));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("confirms before permanently deleting the profile, then signs out", async () => {
    const alert = jest.spyOn(Alert, "alert");
    await renderProfile();

    await fireEvent.press(screen.getByText("Delete Account"));
    expect(alert).toHaveBeenCalledWith(
      "Delete account?",
      "This permanently deletes your Do It for Jesus profile and cannot be undone.",
      expect.any(Array),
    );
    expect(mockDeleteProfile).not.toHaveBeenCalled();

    const buttons = alert.mock.calls[0]?.[2] ?? [];
    const confirm = buttons.find((button) => button.text === "Delete Account");
    await act(async () => {
      confirm?.onPress?.();
      confirm?.onPress?.();
    });

    await waitFor(() => {
      expect(mockDeleteProfile).toHaveBeenCalledTimes(1);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
    alert.mockRestore();
  });

  it("shows a recoverable profile error without hiding static settings", async () => {
    mockFetchProfile.mockRejectedValue(new Error("Network unavailable"));
    await render(
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <ProfileSettingsScreen />
      </SafeAreaProvider>,
    );

    expect(await screen.findByText("We couldn't load your profile.")).toBeTruthy();
    expect(screen.getByText("Contact Support")).toBeTruthy();
    expect(screen.getByText("Try Again")).toBeTruthy();
  });
});
