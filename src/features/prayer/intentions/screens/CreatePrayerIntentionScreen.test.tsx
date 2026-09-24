import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";
import { CreatePrayerIntentionScreen } from "./CreatePrayerIntentionScreen";

const mockBack = jest.fn();
const mockCreatePrayerIntention = jest.fn();
const mockInvalidateMyPrayerIntentions = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack, replace: mockReplace }) }));
jest.mock("@/features/prayer/intentions", () => ({
  createPrayerIntention: (...args: unknown[]) => mockCreatePrayerIntention(...args),
  getPrayerIntentionTheme: () => ({ icon: "star", surface: "#123", surfaceLight: "#456" }),
  invalidateMyPrayerIntentions: (...args: unknown[]) => mockInvalidateMyPrayerIntentions(...args),
  prayerIntentionSymbols: ["candle", "dove", "olive_branch", "cross"],
}));

describe("CreatePrayerIntentionScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockCreatePrayerIntention.mockResolvedValue({ id: "intention-1" });
    await i18n.changeLanguage("en");
  });

  it("submits the form, replaces it with the user's intentions, and lets the user choose a symbol", async () => {
    await render(<CreatePrayerIntentionScreen />);

    expect(screen.getByRole("button", { name: "Faith struggles" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Health concerns" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "In memory" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Joyful news" })).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Title"), "For my family");
    await fireEvent.changeText(screen.getByLabelText("Description"), "Please pray for peace at home.");
    await fireEvent.press(screen.getByRole("button", { name: "In memory" }));
    await fireEvent.press(screen.getByText("Submit for Review"));

    expect(mockCreatePrayerIntention).toHaveBeenCalledWith({
      description: "Please pray for peace at home.",
      symbol: "dove",
      title: "For my family",
    });
    expect(mockInvalidateMyPrayerIntentions).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/my-prayer-intentions");
  });

  it("shows the backend error and allows navigating back", async () => {
    mockCreatePrayerIntention.mockRejectedValue(new Error("Please provide a title."));
    await render(<CreatePrayerIntentionScreen />);

    await fireEvent.press(screen.getByText("Submit for Review"));
    expect(await screen.findByText("Please provide a title.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("shows the concise symbol descriptions in Spanish", async () => {
    const rendered = await render(<CreatePrayerIntentionScreen />);

    await act(async () => {
      await i18n.changeLanguage("es");
    });
    await rendered.rerender(<CreatePrayerIntentionScreen />);

    expect(screen.getByRole("button", { name: "Dificultades de fe" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Problemas de salud" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "En memoria" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Noticias alegres" })).toBeTruthy();
  });
});
