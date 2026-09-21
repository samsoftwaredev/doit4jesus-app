import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { AppState, Button, Text } from "react-native";

import type { CurrentUserProfile } from "@/features/profile/profile.types";

import { AccountLanguagePreferenceSync } from "./AccountLanguagePreferenceSync";
import { AppLanguageProvider, useAppLanguage } from "./AppLanguageProvider";

const mockUpdateProfile = jest.fn();
const mockReplaceProfile = jest.fn();
let mockProfile: CurrentUserProfile | null;
let foregroundListener: ((state: string) => void) | undefined;

jest.mock("@/features/profile", () => ({
  useCurrentProfile: () => ({ profile: mockProfile, replaceProfile: mockReplaceProfile }),
}));

jest.mock("@/features/profile/profile.api", () => ({
  updateCurrentUserProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

const profile = {
  preferredLanguage: "en",
  userId: "user-1",
} as CurrentUserProfile;

/** Exposes the language context to the synchronization integration tests. */
function LanguageHarness() {
  const { language, setLanguage } = useAppLanguage();

  /** Selects Spanish through the same public context action used by language controls. */
  function selectSpanish() {
    void setLanguage("es");
  }

  return (
    <>
      <Text>{language}</Text>
      <Button title="Select Spanish" onPress={selectSpanish} />
    </>
  );
}

/** Renders an authenticated language flow with a controllable current profile. */
async function renderLanguageSync() {
  return await render(
    <AppLanguageProvider>
      <AccountLanguagePreferenceSync>
        <LanguageHarness />
      </AccountLanguagePreferenceSync>
    </AppLanguageProvider>,
  );
}

describe("AccountLanguagePreferenceSync", () => {
  const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
  const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfile = profile;
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue();
    mockUpdateProfile.mockResolvedValue({ ...profile, preferredLanguage: "es" });
    jest.spyOn(AppState, "addEventListener").mockImplementation((_event, listener) => {
      foregroundListener = listener as (state: string) => void;
      return { remove: jest.fn() } as never;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("updates the authenticated account after an explicit language choice", async () => {
    await renderLanguageSync();

    await screen.findByText("en");
    fireEvent.press(screen.getByRole("button", { name: "Select Spanish" }));

    expect(await screen.findByText("es")).toBeTruthy();
    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith({ preferredLanguage: "es" }));
    expect(mockReplaceProfile).toHaveBeenCalledWith(expect.objectContaining({ preferredLanguage: "es" }));
  });

  it("restores a valid account preference when this device has no local choice", async () => {
    mockProfile = { ...profile, preferredLanguage: "es" };

    await renderLanguageSync();

    expect(await screen.findByText("es")).toBeTruthy();
    expect(mockSetItem).toHaveBeenCalledWith("@doit4jesus/language-preference:v1", "es");
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("does not call the backend without an authenticated profile", async () => {
    mockProfile = null;
    await renderLanguageSync();

    await screen.findByText("en");
    fireEvent.press(screen.getByRole("button", { name: "Select Spanish" }));

    expect(await screen.findByText("es")).toBeTruthy();
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("keeps a failed account update pending and retries it in the foreground", async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({
      ...profile,
      preferredLanguage: "es",
    });
    await renderLanguageSync();

    await screen.findByText("en");
    fireEvent.press(screen.getByRole("button", { name: "Select Spanish" }));
    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledTimes(1));
    await act(async () => undefined);

    await act(async () => foregroundListener?.("active"));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledTimes(2));
  });
});
