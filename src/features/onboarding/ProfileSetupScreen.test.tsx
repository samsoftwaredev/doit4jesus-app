import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { CurrentUserProfile } from "@/features/profile/profile.types";

import { ProfileSetupScreen } from "./ProfileSetupScreen";

const mockCompleteOnboarding = jest.fn();
const mockGetCountries = jest.fn();
const mockGetNotificationPreferences = jest.fn();
const mockReplaceNotificationPreferences = jest.fn();
const mockReplaceProfile = jest.fn();
const mockRouterReplace = jest.fn();
const mockUpdateNotificationPreferences = jest.fn();
const mockUpdateProfile = jest.fn();
const mockValidateUsername = jest.fn();

let mockCurrentProfile: CurrentUserProfile;
let mockCurrentPreferences: {
  confessionReminder: boolean;
  dailyRosaryReminder: boolean;
  eucharisticAdoration: boolean;
} | null;

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

jest.mock("@/features/profile", () => ({
  useCurrentProfile: () => ({
    notificationPreferences: mockCurrentPreferences,
    profile: mockCurrentProfile,
    replaceNotificationPreferences: mockReplaceNotificationPreferences,
    replaceProfile: mockReplaceProfile,
  }),
}));

jest.mock("@/features/profile/profile.api", () => {
  const actual = jest.requireActual("@/features/profile/profile.api");
  return {
    ...actual,
    updateCurrentUserProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  };
});

jest.mock("./onboarding.api", () => {
  const actual = jest.requireActual("./onboarding.api");
  return {
    ...actual,
    completeOnboarding: (...args: unknown[]) => mockCompleteOnboarding(...args),
    getCities: jest.fn(),
    getCountries: (...args: unknown[]) => mockGetCountries(...args),
    getNotificationPreferences: (...args: unknown[]) => mockGetNotificationPreferences(...args),
    updateNotificationPreferences: (...args: unknown[]) => mockUpdateNotificationPreferences(...args),
    validateUsername: (...args: unknown[]) => mockValidateUsername(...args),
  };
});

const safeAreaMetrics = {
  frame: { height: 844, width: 390, x: 0, y: 0 },
  insets: { bottom: 0, left: 0, right: 0, top: 0 },
};

const baseProfile: CurrentUserProfile = {
  avatarUrl: null,
  cityId: "city-austin",
  cityName: "Austin",
  countryCode: "US",
  countryName: "United States",
  createdAt: "2026-08-28T12:00:00.000Z",
  displayName: "Samuel Ruiz",
  gender: "male",
  leaderboardVisibility: "public",
  preferredLanguage: "en",
  profileSetup: {
    complete: false,
    completedAt: null,
    missingFields: ["city"],
    nextStep: "city",
  },
  prayerMapVisibility: "aggregated",
  saintAvatarId: null,
  state: "Texas",
  timezone: "America/Chicago",
  title: "Faithful Beginner",
  updatedAt: "2026-08-28T12:00:00.000Z",
  userId: "user-1",
  username: "SamuelR",
};

const preferences = {
  confessionReminder: true,
  dailyRosaryReminder: true,
  eucharisticAdoration: true,
};

async function renderSetup(
  profile: CurrentUserProfile = baseProfile,
  notificationPreferences: typeof mockCurrentPreferences = null,
) {
  mockCurrentProfile = profile;
  mockCurrentPreferences = notificationPreferences;
  return render(
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <ProfileSetupScreen />
    </SafeAreaProvider>,
  );
}

describe("required profile setup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentProfile = baseProfile;
    mockCurrentPreferences = null;
    mockGetCountries.mockResolvedValue({
      countries: [],
      meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 },
    });
    mockGetNotificationPreferences.mockResolvedValue(preferences);
    mockUpdateNotificationPreferences.mockImplementation(async (update) => ({ ...preferences, ...update }));
    mockValidateUsername.mockResolvedValue({
      available: true,
      normalizedUsername: "joyful_clare",
      reason: null,
      suggestions: [],
      username: "joyful_clare",
      valid: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resumes at the server-provided City step and preserves earlier values when going back", async () => {
    await renderSetup({
      ...baseProfile,
      cityId: null,
      cityName: null,
      profileSetup: { complete: false, completedAt: null, missingFields: ["city"], nextStep: "city" },
      state: null,
    });

    expect(screen.getByText("Which city are you in?")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Previous setup step"));

    expect(screen.getByText("Which country will you represent?")).toBeTruthy();
    expect(screen.getByLabelText("Country, United States")).toBeTruthy();
  });

  it("trims surrounding display-name whitespace and uses the normalized PATCH response", async () => {
    const incomplete = {
      ...baseProfile,
      cityId: null,
      cityName: null,
      countryCode: null,
      countryName: null,
      displayName: null,
      gender: null,
      profileSetup: {
        complete: false,
        completedAt: null,
        missingFields: ["displayName", "username", "gender", "country", "city"],
        nextStep: "displayName",
      },
      state: null,
      username: null,
    } satisfies CurrentUserProfile;
    mockUpdateProfile.mockResolvedValue({
      ...incomplete,
      displayName: "Samuel Ruiz",
      profileSetup: {
        ...incomplete.profileSetup,
        missingFields: ["username", "gender", "country", "city"],
        nextStep: "username",
      },
    });
    await renderSetup(incomplete);

    await fireEvent.changeText(screen.getByLabelText("Display Name"), "  Samuel   Ruiz  ");
    await fireEvent.press(screen.getByTestId("profile-setup-next"));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith({ displayName: "Samuel   Ruiz" }));
    expect(await screen.findByText("Choose your username")).toBeTruthy();
  });

  it("debounces authoritative username validation before PATCHing", async () => {
    jest.useFakeTimers();
    const profile = {
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["username"], nextStep: "username" },
      username: null,
    } satisfies CurrentUserProfile;
    mockUpdateProfile.mockResolvedValue({ ...profile, username: "joyful_clare" });
    await renderSetup(profile);

    await fireEvent.changeText(screen.getByLabelText("Username"), "joyful_clare");
    expect(mockValidateUsername).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(999);
      await Promise.resolve();
    });
    expect(mockValidateUsername).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });

    expect(mockValidateUsername).toHaveBeenCalledWith("joyful_clare", expect.any(AbortSignal));
    expect(screen.getByText("Username is available.")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("profile-setup-next"));
    expect(mockUpdateProfile).toHaveBeenCalledWith({ username: "joyful_clare" });
    jest.useRealTimers();
  });

  it("invalidates a saved city when the country changes", async () => {
    mockGetCountries.mockResolvedValue({
      countries: [{ code: "MX", latitude: null, longitude: null, name: "Mexico" }],
      meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 },
    });
    mockUpdateProfile.mockResolvedValue({
      ...baseProfile,
      countryCode: "MX",
      countryName: "Mexico",
      profileSetup: { ...baseProfile.profileSetup, nextStep: "city" },
    });
    await renderSetup({
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["country"], nextStep: "country" },
    });

    await fireEvent.press(screen.getByLabelText("Country, United States"));
    expect(await screen.findByLabelText("Mexico")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Mexico"));
    await fireEvent.press(screen.getByTestId("profile-setup-next"));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith({ countryCode: "MX" }));
    expect(await screen.findByText("Which city are you in?")).toBeTruthy();
    expect(screen.getByLabelText("City").props.value).toBe("");
  });

  it("loads API notification defaults and persists the latest toggles before All Set", async () => {
    await renderSetup({
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["notifications"], nextStep: "notifications" },
    });

    expect(await screen.findByLabelText("Eucharistic Adoration")).toBeTruthy();
    await fireEvent(screen.getByLabelText("Eucharistic Adoration"), "valueChange", false);
    await fireEvent.press(screen.getByTestId("profile-setup-next"));

    await waitFor(() =>
      expect(mockUpdateNotificationPreferences).toHaveBeenCalledWith({
        confessionReminder: true,
        dailyRosaryReminder: true,
        eucharisticAdoration: false,
      }),
    );
    expect(await screen.findByText("You’re all set!")).toBeTruthy();
  });

  it("completes transactionally, updates both caches, and replaces navigation", async () => {
    const completeProfile = {
      ...baseProfile,
      profileSetup: {
        complete: true,
        completedAt: "2026-08-28T13:00:00.000Z",
        missingFields: [],
        nextStep: null,
      },
    } satisfies CurrentUserProfile;
    mockCompleteOnboarding.mockResolvedValue({ notificationPreferences: preferences, profile: completeProfile });
    await renderSetup(
      {
        ...baseProfile,
        profileSetup: { complete: false, completedAt: null, missingFields: [], nextStep: null },
      },
      preferences,
    );

    await fireEvent.press(screen.getByText("Enter the Mission"));

    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/"));
    expect(mockCompleteOnboarding).toHaveBeenCalledWith({
      cityId: "city-austin",
      countryCode: "US",
      displayName: "Samuel Ruiz",
      gender: "male",
      notificationPreferences: preferences,
      username: "SamuelR",
    });
    expect(mockReplaceProfile).toHaveBeenCalledWith(completeProfile);
    expect(mockReplaceNotificationPreferences).toHaveBeenCalledWith(preferences);
  });

  it("stays on All Set with preserved state when completion fails", async () => {
    mockCompleteOnboarding.mockRejectedValue(new Error("offline"));
    await renderSetup(
      {
        ...baseProfile,
        profileSetup: { complete: false, completedAt: null, missingFields: [], nextStep: null },
      },
      preferences,
    );

    await fireEvent.press(screen.getByText("Enter the Mission"));

    expect(
      await screen.findByText(
        "We couldn't complete your setup. Your previous answers are still saved. Please try again.",
      ),
    ).toBeTruthy();
    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(screen.getByText("You’re all set!")).toBeTruthy();
    expect(screen.getByTestId("profile-setup-next").props.accessibilityState.disabled).toBe(false);
  });
});
