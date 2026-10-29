import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { CurrentUserProfile } from "@/features/profile/profile.types";
import { AppLanguageProvider } from "@/localization";
import { AchievementProvider, useAchievement } from "@/features/achievements";

import { languageOnboardingStorageKey } from "./onboarding-language";
import { OnboardingApiError } from "./onboarding.api";
import { ProfileSetupScreen } from "./ProfileSetupScreen";

const mockCompleteOnboarding = jest.fn();
const mockGetCountries = jest.fn();
const mockGetRandomUsernames = jest.fn();
const mockReplaceProfile = jest.fn();
const mockRouterReplace = jest.fn();
const mockUpdateProfile = jest.fn();
const mockValidateUsername = jest.fn();
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

let mockCurrentProfile: CurrentUserProfile;
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

jest.mock("@/features/profile", () => ({
  useCurrentProfile: () => ({
    profile: mockCurrentProfile,
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
    getCountries: (...args: unknown[]) => mockGetCountries(...args),
    getRandomUsernames: (...args: unknown[]) => mockGetRandomUsernames(...args),
    validateUsername: (...args: unknown[]) => mockValidateUsername(...args),
  };
});

const safeAreaMetrics = {
  frame: { height: 844, width: 390, x: 0, y: 0 },
  insets: { bottom: 0, left: 0, right: 0, top: 0 },
};

const baseProfile: CurrentUserProfile = {
  avatarUrl: null,
  countryCode: "US",
  countryName: "United States",
  createdAt: "2026-08-28T12:00:00.000Z",
  displayName: "Virgin Mary",
  gender: "male",
  leaderboardVisibility: "public",
  legalAcceptance: {
    accepted: true,
    acceptedAt: "2026-10-27T06:00:00.000Z",
    communityGuidelinesVersion: "2026-10-28",
    grandfathered: false,
    privacyVersion: "2026-10-28",
    required: false,
    termsVersion: "2026-10-28",
  },
  preferredLanguage: "en",
  profileSetup: {
    complete: false,
    completedAt: null,
    missingFields: ["notifications"],
    nextStep: "notifications",
  },
  prayerMapVisibility: "aggregated",
  saintAvatarId: null,
  timezone: "America/Chicago",
  title: "Faithful Beginner",
  updatedAt: "2026-08-28T12:00:00.000Z",
  userId: "user-1",
  username: "VirginMary",
};

async function renderSetup(profile: CurrentUserProfile = baseProfile) {
  mockCurrentProfile = profile;
  return render(
    <AchievementProvider>
      <AppLanguageProvider>
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ProfileSetupScreen />
          <QueuedAchievementProbe />
        </SafeAreaProvider>
      </AppLanguageProvider>
    </AchievementProvider>,
  );
}

/** Exposes the queued onboarding event so completion tests can verify its success boundary. */
function QueuedAchievementProbe() {
  const { achievement } = useAchievement();
  return <Text>{achievement?.type ?? "none"}</Text>;
}

describe("required profile setup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockImplementation(async (key) => (String(key).includes("onboarding-language") ? "complete" : null));
    mockSetItem.mockResolvedValue();
    mockCurrentProfile = baseProfile;
    mockGetCountries.mockResolvedValue({
      countries: [],
      meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 },
    });
    mockGetRandomUsernames.mockResolvedValue([
      "faithful_clare1842",
      "monica_dove7391",
      "hopeful_pilgrim2318",
      "dominic_witness4430",
      "joyful_rosary8724",
    ]);
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

  it("asks for language first, translates immediately, and resumes the server step after confirmation", async () => {
    mockGetItem.mockResolvedValue(null);
    const incomplete = {
      ...baseProfile,
      displayName: null,
      profileSetup: {
        complete: false,
        completedAt: null,
        missingFields: ["displayName"],
        nextStep: "displayName",
      },
    } satisfies CurrentUserProfile;

    await renderSetup(incomplete);

    expect(await screen.findByRole("header", { name: "Choose your language" })).toBeTruthy();
    expect(screen.getByLabelText("Step 1 of 5")).toBeTruthy();

    await fireEvent.press(screen.getByRole("radio", { name: "Español" }));
    expect(await screen.findByRole("header", { name: "Elige tu idioma" })).toBeTruthy();

    await fireEvent.press(screen.getByText("Continuar"));

    expect(await screen.findByRole("header", { name: "¿Cuál es tu nombre y apellido?" })).toBeTruthy();
    expect(mockSetItem).toHaveBeenCalledWith(languageOnboardingStorageKey(baseProfile.userId), "complete");
    expect(screen.getByLabelText("Paso 2 de 5")).toBeTruthy();
  });

  it("resumes at the server-provided country step and preserves earlier values when going back", async () => {
    await renderSetup({
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["country"], nextStep: "country" },
    });

    expect(screen.getByText("Which country will you represent?")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Previous setup step"));

    expect(screen.getByText("Who do you identify as?")).toBeTruthy();
  });

  it("requires first and last names, explains invalid input, and saves a normalized name", async () => {
    const incomplete = {
      ...baseProfile,
      countryCode: null,
      countryName: null,
      displayName: null,
      gender: null,
      profileSetup: {
        complete: false,
        completedAt: null,
        missingFields: ["displayName", "username", "gender", "country"],
        nextStep: "displayName",
      },
      username: null,
    } satisfies CurrentUserProfile;
    mockUpdateProfile.mockResolvedValue({
      ...incomplete,
      displayName: "Virgin Mary",
      profileSetup: {
        ...incomplete.profileSetup,
        missingFields: ["username", "gender", "country"],
        nextStep: "username",
      },
    });
    await renderSetup(incomplete);

    await fireEvent.changeText(screen.getByLabelText("Display Name"), "Virgin3 Mary");
    expect(await screen.findByText("Your name cannot contain numbers.")).toBeTruthy();
    expect(screen.getByTestId("profile-setup-next").props.accessibilityState.disabled).toBe(true);

    await fireEvent.changeText(screen.getByLabelText("Display Name"), "Virgin");
    expect(await screen.findByText("Enter both your first and last name, separated by a space.")).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText("Display Name"), "  Virgin   Mary  ");
    await fireEvent.press(screen.getByTestId("profile-setup-next"));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith({ displayName: "Virgin Mary" }));
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

  it("prefills the first generated username and revalidates it before enabling Continue", async () => {
    jest.useFakeTimers();
    const profile = {
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["username"], nextStep: "username" },
      username: null,
    } satisfies CurrentUserProfile;
    mockValidateUsername.mockResolvedValue({
      available: true,
      normalizedUsername: "faithful_clare1842",
      reason: null,
      suggestions: [],
      username: "faithful_clare1842",
      valid: true,
    });

    await renderSetup(profile);

    expect(await screen.findByDisplayValue("faithful_clare1842")).toBeTruthy();
    expect(mockGetRandomUsernames).toHaveBeenCalledWith(expect.any(AbortSignal));
    expect(screen.getByTestId("profile-setup-next").props.accessibilityState.disabled).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(mockValidateUsername).toHaveBeenCalledWith("faithful_clare1842", expect.any(AbortSignal));
    expect(screen.getByText("Username is available.")).toBeTruthy();
    expect(screen.getByTestId("profile-setup-next").props.accessibilityState.disabled).toBe(false);
  });

  it("does not replace a username entered while generation is pending", async () => {
    let resolveUsernames: (usernames: string[]) => void = () => undefined;
    mockGetRandomUsernames.mockReturnValue(
      new Promise<string[]>((resolve) => {
        resolveUsernames = resolve;
      }),
    );
    const profile = {
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["username"], nextStep: "username" },
      username: null,
    } satisfies CurrentUserProfile;

    await renderSetup(profile);
    const input = await screen.findByLabelText("Username");
    await fireEvent.changeText(input, "manual_pilgrim");
    await act(async () => resolveUsernames(["faithful_clare1842"]));

    expect(screen.getByLabelText("Username").props.value).toBe("manual_pilgrim");
  });

  it("keeps manual username entry available when generation fails", async () => {
    jest.useFakeTimers();
    mockGetRandomUsernames.mockRejectedValue(new Error("offline"));
    const profile = {
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["username"], nextStep: "username" },
      username: null,
    } satisfies CurrentUserProfile;

    await renderSetup(profile);
    const input = await screen.findByLabelText("Username");
    await waitFor(() => expect(mockGetRandomUsernames).toHaveBeenCalledTimes(1));
    expect(input.props.value).toBe("");
    expect(screen.queryByText("We couldn't check this username. Try again.")).toBeNull();

    await fireEvent.changeText(input, "manual_pilgrim");
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    expect(mockValidateUsername).toHaveBeenCalledWith("manual_pilgrim", expect.any(AbortSignal));
  });

  it("preserves a saved username without requesting a generated replacement", async () => {
    await renderSetup({
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["username"], nextStep: "username" },
    });

    expect(await screen.findByDisplayValue("VirginMary")).toBeTruthy();
    expect(mockGetRandomUsernames).not.toHaveBeenCalled();
  });

  it("keeps the username stable until the user selects a backend suggestion", async () => {
    jest.useFakeTimers();
    const profile = {
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["username"], nextStep: "username" },
      username: null,
    } satisfies CurrentUserProfile;
    mockValidateUsername
      .mockRejectedValueOnce(
        new OnboardingApiError("Username unavailable", 409, "USERNAME_TAKEN", ["virgin_mary_123", "virgin_mary_456"]),
      )
      .mockResolvedValueOnce({
        available: true,
        normalizedUsername: "virgin_mary_123",
        reason: null,
        suggestions: [],
        username: "virgin_mary_123",
        valid: true,
      });

    await renderSetup(profile);

    expect(screen.getByLabelText("Username").props.value).toBe("faithful_clare1842");
    await fireEvent.changeText(screen.getByLabelText("Username"), "VirginMary");

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(mockValidateUsername).toHaveBeenCalledWith("VirginMary", expect.any(AbortSignal));
    expect(screen.getByLabelText("Username").props.value).toBe("VirginMary");
    expect(screen.getByText("Suggestions")).toBeTruthy();
    expect(screen.getByRole("button", { name: "virgin_mary_123" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "virgin_mary_456" })).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "virgin_mary_456" }));
    expect(screen.getByLabelText("Username").props.value).toBe("virgin_mary_456");
    jest.useRealTimers();
  });

  it("completes from the country step and routes Home with the achievement queued", async () => {
    mockGetCountries.mockResolvedValue({
      countries: [{ code: "MX", latitude: null, longitude: null, name: "Mexico" }],
      meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 },
    });
    const completeProfile = {
      ...baseProfile,
      countryCode: "MX",
      countryName: "Mexico",
      profileSetup: { complete: true, completedAt: "2026-08-28T13:00:00.000Z", missingFields: [], nextStep: null },
    } satisfies CurrentUserProfile;
    mockUpdateProfile.mockResolvedValue({ ...baseProfile, countryCode: "MX", countryName: "Mexico" });
    mockCompleteOnboarding.mockResolvedValue({ profile: completeProfile });
    await renderSetup({
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["country"], nextStep: "country" },
    });

    await fireEvent.press(screen.getByLabelText("Country, United States"));
    await fireEvent.changeText(screen.getByLabelText("Search countries"), "Mexico");
    expect(await screen.findByLabelText("Mexico")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Mexico"));
    await fireEvent.press(screen.getByTestId("profile-setup-next"));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith({ countryCode: "MX" }));
    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/"));
    expect(mockCompleteOnboarding).toHaveBeenCalledWith({
      countryCode: "MX",
      displayName: "Virgin Mary",
      gender: "male",
      username: "VirginMary",
    });
    expect(mockReplaceProfile).toHaveBeenCalledWith(completeProfile);
    expect(screen.getByText("onboarding-complete")).toBeTruthy();
  });

  it("keeps the country step retryable when final completion fails", async () => {
    mockCompleteOnboarding.mockRejectedValue(new Error("offline"));
    await renderSetup({
      ...baseProfile,
      profileSetup: { complete: false, completedAt: null, missingFields: ["country"], nextStep: "country" },
    });

    await fireEvent.press(screen.getByTestId("profile-setup-next"));

    expect(
      await screen.findByText(
        "We couldn't complete your setup. Your previous answers are still saved. Please try again.",
      ),
    ).toBeTruthy();
    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Which country will you represent?")).toBeTruthy();
    expect(screen.getByTestId("profile-setup-next").props.accessibilityState.disabled).toBe(false);
  });
});
