import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import { i18n } from "@/localization";

import type { ChurchSummary } from "../../churches.types";
import { ChurchReminderSetupProvider, useChurchReminderSetup } from "./ChurchReminderSetupProvider";

const mockQueueAchievement = jest.fn();
const mockGetSubscriptions = jest.fn();
const mockCreateSubscription = jest.fn();
const mockUpdateSubscription = jest.fn();
const mockDeleteSubscription = jest.fn();

jest.mock("@/features/achievements", () => ({
  useAchievement: () => ({ queueAchievement: mockQueueAchievement }),
}));

jest.mock("../../churches.api", () => ({
  ChurchApiError: class ChurchApiError extends Error {},
  createChurchSubscription: (...args: unknown[]) => mockCreateSubscription(...args),
  deleteChurchSubscription: (...args: unknown[]) => mockDeleteSubscription(...args),
  getChurchSubscriptions: (...args: unknown[]) => mockGetSubscriptions(...args),
  updateChurchSubscription: (...args: unknown[]) => mockUpdateSubscription(...args),
}));

const church: ChurchSummary = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  dioceseId: null,
  dioceseName: null,
  directoryVerificationStatus: "verified",
  distanceMiles: 1.4,
  id: "church-1",
  latitude: 30.273,
  longitude: -97.739,
  name: "St. Mary Cathedral",
  postalCode: "78701",
  regionName: "Texas",
  scheduleStatus: "verified",
  timezone: "America/Chicago",
};
const secondChurch = { ...church, id: "church-2", name: "St. Austin" };
const thirdChurch = { ...church, id: "church-3", name: "Holy Family" };
const fourthChurch = { ...church, id: "church-4", name: "St. Joseph" };

/** Exposes provider behavior through accessible controls for integration testing. */
function SetupHarness() {
  const setup = useChurchReminderSetup();
  return (
    <View>
      <Text>{`loading:${setup.isLoadingSubscriptions}`}</Text>
      <Text>{`existing:${setup.existingSubscriptions.length}`}</Text>
      <Text>{`drafts:${setup.drafts.length}`}</Text>
      {setup.errorMessage ? <Text accessibilityRole="alert">{setup.errorMessage}</Text> : null}
      {setup.mutationFailures.map((failure) => (
        <Text key={failure.churchId}>{failure.name}</Text>
      ))}
      <Pressable accessibilityRole="button" onPress={() => setup.toggleSelectedChurch(church)}>
        <Text>Toggle church</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleServiceType(church.id, "mass")}>
        <Text>Toggle Mass</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleServiceType(church.id, "confession")}>
        <Text>Toggle Confession</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleSelectedChurch(secondChurch)}>
        <Text>Toggle second church</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleSelectedChurch(thirdChurch)}>
        <Text>Toggle third church</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleSelectedChurch(fourthChurch)}>
        <Text>Toggle fourth church</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleServiceType(secondChurch.id, "confession")}>
        <Text>Toggle second Confession</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setup.toggleWeekday(church.id, "sunday")}>
        <Text>Toggle Sunday</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => void setup.completeSetup()}>
        <Text>Save</Text>
      </Pressable>
    </View>
  );
}

describe("ChurchReminderSetupProvider", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
    mockGetSubscriptions.mockResolvedValue([]);
    mockCreateSubscription.mockResolvedValue({
      church,
      churchId: church.id,
      notificationWeekdays: ["sunday"],
      scheduleReady: true,
      serviceTypes: ["mass"],
    });
    mockUpdateSubscription.mockResolvedValue(undefined);
    mockDeleteSubscription.mockResolvedValue(undefined);
  });

  it("loads subscriptions once and exposes them as editable drafts", async () => {
    mockGetSubscriptions.mockResolvedValue([
      {
        church,
        churchId: church.id,
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);

    await render(
      <ChurchReminderSetupProvider>
        <SetupHarness />
      </ChurchReminderSetupProvider>,
    );

    expect(await screen.findByText("existing:1")).toBeTruthy();
    expect(screen.getByText("drafts:1")).toBeTruthy();
    expect(mockGetSubscriptions).toHaveBeenCalledTimes(1);
  });

  it("creates a valid first-time reminder setup and queues its first celebration", async () => {
    await render(
      <ChurchReminderSetupProvider>
        <SetupHarness />
      </ChurchReminderSetupProvider>,
    );
    await screen.findByText("loading:false");

    await fireEvent.press(screen.getByRole("button", { name: "Toggle church" }));
    await fireEvent.press(screen.getByRole("button", { name: "Toggle Mass" }));
    await fireEvent.press(screen.getByRole("button", { name: "Toggle Sunday" }));
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(mockCreateSubscription).toHaveBeenCalledWith({
        churchId: church.id,
        notificationWeekdays: ["sunday"],
        serviceTypes: ["mass"],
      }),
    );
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "church-reminders-configured" });
  });

  it("keeps incomplete reminder drafts unsaved with localized validation", async () => {
    await render(
      <ChurchReminderSetupProvider>
        <SetupHarness />
      </ChurchReminderSetupProvider>,
    );
    await screen.findByText("loading:false");

    await fireEvent.press(screen.getByRole("button", { name: "Toggle church" }));
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose at least one service and one reminder day for every selected church.",
    );
    expect(mockCreateSubscription).not.toHaveBeenCalled();
  });

  it("enforces the three-church limit before saving", async () => {
    await render(
      <ChurchReminderSetupProvider>
        <SetupHarness />
      </ChurchReminderSetupProvider>,
    );
    await screen.findByText("loading:false");
    await fireEvent.press(screen.getByRole("button", { name: "Toggle church" }));
    await fireEvent.press(screen.getByRole("button", { name: "Toggle second church" }));
    await fireEvent.press(screen.getByRole("button", { name: "Toggle third church" }));
    await fireEvent.press(screen.getByRole("button", { name: "Toggle fourth church" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You can only follow 3 churches at a time. Remove one to add another.",
    );
    expect(screen.getByText("drafts:3")).toBeTruthy();
  });

  it("retries only the church mutation that failed after partial success", async () => {
    mockGetSubscriptions.mockResolvedValue([
      { church, churchId: church.id, notificationWeekdays: ["sunday"], scheduleReady: true, serviceTypes: ["mass"] },
      {
        church: secondChurch,
        churchId: secondChurch.id,
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);
    mockUpdateSubscription.mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    await render(
      <ChurchReminderSetupProvider>
        <SetupHarness />
      </ChurchReminderSetupProvider>,
    );
    await screen.findByText("drafts:2");
    await fireEvent.press(screen.getByRole("button", { name: "Toggle Confession" }));
    await fireEvent.press(screen.getByRole("button", { name: "Toggle second Confession" }));
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("St. Mary Cathedral")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(mockUpdateSubscription).toHaveBeenCalledTimes(3));
    expect(mockUpdateSubscription.mock.calls.map(([churchId]) => churchId)).toEqual([
      "church-1",
      "church-2",
      "church-1",
    ]);
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "church-reminders-updated" });
  });
});
