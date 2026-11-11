import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import { i18n } from "@/localization";

import type { ChurchSummary } from "../../churches.types";
import { ChurchReminderSetupProvider, useChurchReminderSetup } from "./ChurchReminderSetupProvider";

const mockQueueAchievement = jest.fn();
const mockGetSubscriptions = jest.fn();
const mockCreateSubscription = jest.fn();
const mockDeleteSubscription = jest.fn();

jest.mock("@/features/achievements", () => ({
  useAchievement: () => ({ queueAchievement: mockQueueAchievement }),
}));

jest.mock("../../churches.api", () => ({
  ChurchApiError: class ChurchApiError extends Error {},
  createChurchSubscription: (...args: unknown[]) => mockCreateSubscription(...args),
  deleteChurchSubscription: (...args: unknown[]) => mockDeleteSubscription(...args),
  getChurchSubscriptions: (...args: unknown[]) => mockGetSubscriptions(...args),
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

const followed = (item: ChurchSummary) => ({
  church: item,
  churchId: item.id,
  notificationWeekdays: ["sunday"],
  scheduleReady: true,
  serviceTypes: ["mass"],
});

/** Exposes provider behavior through accessible controls for integration testing. */
function SetupHarness() {
  const setup = useChurchReminderSetup();
  return (
    <View>
      <Text>{`loading:${setup.isLoadingSubscriptions}`}</Text>
      <Text>{`selected:${setup.selectedChurches.map((item) => item.id).join(",")}`}</Text>
      <Text>{`pending:${setup.pendingChurchIds.size}`}</Text>
      <Text>{`limit:${setup.limitReached}`}</Text>
      {setup.errorMessage ? <Text accessibilityRole="alert">{setup.errorMessage}</Text> : null}
      {[church, secondChurch, thirdChurch, fourthChurch].map((item) => (
        <Pressable accessibilityRole="button" key={item.id} onPress={() => setup.toggleSelectedChurch(item)}>
          <Text>{`Toggle ${item.id}`}</Text>
        </Pressable>
      ))}
    </View>
  );
}

async function renderProvider() {
  await render(
    <ChurchReminderSetupProvider>
      <SetupHarness />
    </ChurchReminderSetupProvider>,
  );
  await screen.findByText("loading:false");
}

const toggle = (item: ChurchSummary) => fireEvent.press(screen.getByRole("button", { name: `Toggle ${item.id}` }));

describe("ChurchReminderSetupProvider", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
    mockGetSubscriptions.mockResolvedValue([]);
    mockCreateSubscription.mockResolvedValue({ alreadySubscribed: false });
    mockDeleteSubscription.mockResolvedValue(undefined);
  });

  it("loads the followed churches once", async () => {
    mockGetSubscriptions.mockResolvedValue([followed(church)]);
    await renderProvider();

    expect(screen.getByText("selected:church-1")).toBeTruthy();
    expect(mockGetSubscriptions).toHaveBeenCalledTimes(1);
  });

  it("saves a church as soon as it is added and queues the first celebration", async () => {
    await renderProvider();

    await toggle(church);

    await waitFor(() => expect(mockCreateSubscription).toHaveBeenCalledWith({ churchId: church.id }));
    expect(await screen.findByText("selected:church-1")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "church-reminders-configured" });
  });

  it("celebrates only the first church and shows no toast for later changes", async () => {
    await renderProvider();

    await toggle(church);
    await screen.findByText("selected:church-1");
    await toggle(secondChurch);
    await screen.findByText("selected:church-1,church-2");

    expect(mockQueueAchievement.mock.calls.map(([achievement]) => achievement.type)).toEqual([
      "church-reminders-configured",
    ]);
  });

  it("adds a church the server already follows to the list without a banner", async () => {
    mockCreateSubscription.mockResolvedValue({ alreadySubscribed: true });
    await renderProvider();

    await toggle(church);

    expect(await screen.findByText("selected:church-1")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(mockQueueAchievement).not.toHaveBeenCalled();
  });

  it("saves a removal as soon as it is made", async () => {
    mockGetSubscriptions.mockResolvedValue([followed(church), followed(secondChurch)]);
    await renderProvider();

    await toggle(church);

    await waitFor(() => expect(mockDeleteSubscription).toHaveBeenCalledWith(church.id));
    expect(await screen.findByText("selected:church-2")).toBeTruthy();
    expect(mockQueueAchievement).not.toHaveBeenCalled();
  });

  it("marks a church pending while its request runs and ignores repeat taps", async () => {
    let finish: () => void = () => undefined;
    mockCreateSubscription.mockReturnValue(
      new Promise((resolve) => (finish = () => resolve({ alreadySubscribed: false }))),
    );
    await renderProvider();

    await toggle(church);
    expect(screen.getByText("pending:1")).toBeTruthy();
    await toggle(church);
    expect(mockCreateSubscription).toHaveBeenCalledTimes(1);

    finish();
    expect(await screen.findByText("pending:0")).toBeTruthy();
    expect(screen.getByText("selected:church-1")).toBeTruthy();
  });

  it("refuses a fourth church without calling the API, and recovers once one is removed", async () => {
    mockGetSubscriptions.mockResolvedValue([church, secondChurch, thirdChurch].map(followed));
    await renderProvider();

    await toggle(fourthChurch);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You can only follow 3 churches at a time. Remove one to add another.",
    );
    expect(screen.getByText("limit:true")).toBeTruthy();
    expect(mockCreateSubscription).not.toHaveBeenCalled();

    await toggle(thirdChurch);
    await screen.findByText("selected:church-1,church-2");
    expect(screen.getByText("limit:false")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();

    await toggle(fourthChurch);
    expect(await screen.findByText("selected:church-1,church-2,church-4")).toBeTruthy();
  });

  it("keeps the list unchanged and explains the problem when saving fails", async () => {
    mockGetSubscriptions.mockResolvedValue([followed(church)]);
    mockCreateSubscription.mockRejectedValueOnce(new Error("offline"));
    await renderProvider();

    await toggle(secondChurch);

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn’t save that change. Please try again.");
    expect(screen.getByText("selected:church-1")).toBeTruthy();
    expect(screen.getByText("pending:0")).toBeTruthy();
    expect(mockQueueAchievement).not.toHaveBeenCalled();
  });
});
