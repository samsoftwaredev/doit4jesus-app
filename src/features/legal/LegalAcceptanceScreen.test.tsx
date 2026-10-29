import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { i18n } from "@/localization";

import { LegalAcceptanceScreen } from "./LegalAcceptanceScreen";

const mockAcceptLegalDocuments = jest.fn();
const mockRefreshProfile = jest.fn();
const mockSignOut = jest.fn();
let mockLanguage: "en" | "es" = "en";

jest.mock("@/features/profile", () => ({
  acceptLegalDocuments: (...args: unknown[]) => mockAcceptLegalDocuments(...args),
  useCurrentProfile: () => ({ refreshProfile: mockRefreshProfile }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: { auth: { signOut: (...args: unknown[]) => mockSignOut(...args) } },
}));

jest.mock("@/localization", () => {
  const actual = jest.requireActual("@/localization");
  return { ...actual, useAppLanguage: () => ({ language: mockLanguage }) };
});

const safeAreaMetrics = {
  frame: { height: 844, width: 390, x: 0, y: 0 },
  insets: { bottom: 0, left: 0, right: 0, top: 0 },
};

async function renderScreen() {
  return await render(
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <LegalAcceptanceScreen />
    </SafeAreaProvider>,
  );
}

describe("legal acceptance gate", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockLanguage = "en";
    await i18n.changeLanguage("en");
    mockAcceptLegalDocuments.mockResolvedValue({ accepted: true, required: false });
    mockRefreshProfile.mockResolvedValue(undefined);
    mockSignOut.mockResolvedValue({ error: null });
    jest.spyOn(Linking, "openURL").mockResolvedValue(true);
  });

  afterEach(() => jest.restoreAllMocks());

  it("keeps Continue disabled until the combined adult and US-residency confirmation is selected", async () => {
    const rendered = await renderScreen();

    const continueButton = rendered.getByRole("button", { name: "Accept and Continue" });
    expect(continueButton).toBeDisabled();
    await fireEvent.press(continueButton);
    expect(mockAcceptLegalDocuments).not.toHaveBeenCalled();

    await fireEvent.press(
      rendered.getByRole("checkbox", {
        name: "I confirm that I am at least 18 years old and reside in the United States.",
      }),
    );
    const enabledContinueButton = rendered.getByRole("button", { name: "Accept and Continue" });
    expect(enabledContinueButton).toBeEnabled();
    await fireEvent.press(enabledContinueButton);

    await waitFor(() => expect(mockAcceptLegalDocuments).toHaveBeenCalledWith("en"));
    expect(mockRefreshProfile).toHaveBeenCalledTimes(1);
  });

  it("opens all localized policies and distinguishes agreement from privacy acknowledgment", async () => {
    mockLanguage = "es";
    await i18n.changeLanguage("es");
    const rendered = await renderScreen();

    expect(rendered.getByText(/Reconozco haber leído la/)).toBeTruthy();
    await fireEvent.press(rendered.getByRole("link", { name: "Términos de servicio" }));
    await fireEvent.press(rendered.getByRole("link", { name: "Normas de la comunidad" }));
    await fireEvent.press(rendered.getByRole("link", { name: "Política de privacidad" }));

    expect(Linking.openURL).toHaveBeenCalledWith("https://www.doitforjesus.com/es/terms-of-service");
    expect(Linking.openURL).toHaveBeenCalledWith("https://www.doitforjesus.com/es/community-guidelines");
    expect(Linking.openURL).toHaveBeenCalledWith("https://www.doitforjesus.com/es/privacy-policy");
  });

  it("allows an idempotent retry and provides sign-out recovery", async () => {
    mockAcceptLegalDocuments.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ accepted: true });
    const rendered = await renderScreen();
    await fireEvent.press(rendered.getByRole("checkbox"));
    await fireEvent.press(rendered.getByRole("button", { name: "Accept and Continue" }));

    expect(await rendered.findByText(/couldn't record your acceptance/)).toBeTruthy();
    await fireEvent.press(rendered.getByRole("button", { name: "Accept and Continue" }));
    await waitFor(() => expect(mockAcceptLegalDocuments).toHaveBeenCalledTimes(2));

    await fireEvent.press(rendered.getByRole("button", { name: "Sign Out" }));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
