import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ChurchReminderReviewScreen } from "./ChurchReminderReviewScreen";

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCompleteSetup = jest.fn();
const mockToggleSelectedChurch = jest.fn();
const mockToggleServiceType = jest.fn();
const mockToggleWeekday = jest.fn();
let mockSetup: Record<string, unknown>;

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, canGoBack: () => false, replace: mockReplace }),
}));
jest.mock("../components", () => ({ useChurchReminderSetup: () => mockSetup }));

const church = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  dioceseId: null,
  dioceseName: null,
  directoryVerificationStatus: "verified" as const,
  distanceMiles: null,
  id: "church-1",
  latitude: 30.273,
  longitude: -97.739,
  name: "St. Mary Cathedral",
  postalCode: "78701",
  regionName: "Texas",
  scheduleStatus: "verified" as const,
  timezone: "America/Chicago",
};

describe("ChurchReminderReviewScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
    mockCompleteSetup.mockResolvedValue(true);
    mockSetup = {
      completeSetup: mockCompleteSetup,
      drafts: [],
      errorMessage: null,
      existingSubscriptions: [],
      isLoadingSubscriptions: false,
      isSaving: false,
      mutationFailures: [],
      toggleSelectedChurch: mockToggleSelectedChurch,
      toggleServiceType: mockToggleServiceType,
      toggleWeekday: mockToggleWeekday,
    };
  });

  it("handles direct empty entry with an action back to discovery", async () => {
    await render(<ChurchReminderReviewScreen />);
    expect(screen.getByText("Select at least one church before reviewing reminders.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Find a church" }));
    expect(mockReplace).toHaveBeenCalledWith("/churches");
  });

  it("edits preferences and navigates Home only after setup completes", async () => {
    mockSetup = {
      ...mockSetup,
      drafts: [{ church, notificationWeekdays: [], serviceTypes: [] }],
    };
    await render(<ChurchReminderReviewScreen />);
    await fireEvent.press(screen.getByRole("checkbox", { name: "Mass" }));
    await fireEvent.press(screen.getByRole("checkbox", { name: "Sunday" }));
    expect(mockToggleServiceType).toHaveBeenCalledWith(church.id, "mass");
    expect(mockToggleWeekday).toHaveBeenCalledWith(church.id, "sunday");

    await fireEvent.press(screen.getByRole("button", { name: "Complete setup" }));
    await waitFor(() => expect(mockCompleteSetup).toHaveBeenCalledTimes(1));
    expect(mockReplace).toHaveBeenCalledWith("/home");
  });

  it("stays on review when a partial mutation fails and exposes retry copy", async () => {
    mockCompleteSetup.mockResolvedValue(false);
    mockSetup = {
      ...mockSetup,
      drafts: [{ church, notificationWeekdays: ["sunday"], serviceTypes: ["mass"] }],
      mutationFailures: [{ churchId: church.id, message: "Could not save", name: church.name }],
    };
    await render(<ChurchReminderReviewScreen />);
    expect(screen.getByText("St. Mary Cathedral: Could not save")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry remaining changes" }));
    await waitFor(() => expect(mockCompleteSetup).toHaveBeenCalled());
    expect(mockReplace).not.toHaveBeenCalledWith("/home");
  });

  it("renders the dedicated route heading in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<ChurchReminderReviewScreen />);
    expect(screen.getByText("Revisar recordatorios")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Encuentra una iglesia" })).toBeTruthy();
  });
});
