import { fireEvent, render, screen } from "@testing-library/react-native";

import { CreatePrayerIntentionScreen } from "./CreatePrayerIntentionScreen";

const mockBack = jest.fn();
const mockCreatePrayerIntention = jest.fn();
const mockInvalidateMyPrayerIntentions = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack }) }));
jest.mock("@/features/prayer/intentions", () => ({
  createPrayerIntention: (...args: unknown[]) => mockCreatePrayerIntention(...args),
  getPrayerIntentionTheme: () => ({ icon: "star", surface: "#123", surfaceLight: "#456" }),
  invalidateMyPrayerIntentions: (...args: unknown[]) => mockInvalidateMyPrayerIntentions(...args),
  prayerIntentionSymbols: ["candle", "dove", "olive_branch", "cross"],
}));

describe("CreatePrayerIntentionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreatePrayerIntention.mockResolvedValue({ id: "intention-1" });
  });

  it("submits the form, resets its fields, and lets the user choose a symbol", async () => {
    await render(<CreatePrayerIntentionScreen />);

    await fireEvent.changeText(screen.getByLabelText("Title"), "For my family");
    await fireEvent.changeText(screen.getByLabelText("Description"), "Please pray for peace at home.");
    await fireEvent.press(screen.getByRole("button", { name: "Use dove symbol" }));
    await fireEvent.press(screen.getByText("Submit for Review"));

    expect(
      await screen.findByText("Prayer intention submitted for review. It will be public after approval."),
    ).toBeTruthy();
    expect(mockCreatePrayerIntention).toHaveBeenCalledWith({
      description: "Please pray for peace at home.",
      symbol: "dove",
      title: "For my family",
    });
    expect(mockInvalidateMyPrayerIntentions).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Title").props.value).toBe("");
  });

  it("shows the backend error and allows navigating back", async () => {
    mockCreatePrayerIntention.mockRejectedValue(new Error("Please provide a title."));
    await render(<CreatePrayerIntentionScreen />);

    await fireEvent.press(screen.getByText("Submit for Review"));
    expect(await screen.findByText("Please provide a title.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
