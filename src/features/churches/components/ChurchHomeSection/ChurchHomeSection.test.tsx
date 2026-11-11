import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { i18n } from "@/localization";
import { theme } from "@/theme/tokens";

import { ChurchHomeSection } from "./ChurchHomeSection";

const mockPush = jest.fn();
const mockGetSubscriptions = jest.fn();
const mockGetUpcoming = jest.fn();

jest.mock("expo-router", () => ({
  useFocusEffect: (effect: () => void | (() => void)) => {
    const React = jest.requireActual("react") as typeof import("react");
    React.useEffect(effect, [effect]);
  },
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../../churches.api", () => ({
  getChurchSubscriptions: (...args: unknown[]) => mockGetSubscriptions(...args),
  getUpcomingChurchServices: (...args: unknown[]) => mockGetUpcoming(...args),
}));

const church = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  dioceseId: "diocese-austin",
  dioceseName: "Diocese of Austin",
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

describe("ChurchHomeSection", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
    mockGetSubscriptions.mockResolvedValue([]);
    mockGetUpcoming.mockResolvedValue({ data: [], meta: { hasMore: false, limit: 50, nextOffset: null, offset: 0 } });
  });

  it("invites an unsubscribed user to find nearby churches", async () => {
    await render(<ChurchHomeSection />);

    const title = await screen.findByRole("header", { name: "He is waiting for you" });
    expect(title).toHaveStyle({ fontFamily: theme.fontFamilies.devotional });
    expect(screen.getByText("Visit Jesus in the tabernacle.")).toBeTruthy();
    expect(screen.getByTestId("church-invitation-header")).toHaveStyle({ borderBottomWidth: 0 });
    expect(screen.getByTestId("church-invitation-background").props).toMatchObject({
      accessible: false,
      contentFit: "cover",
      contentPosition: { right: 0, top: "50%" },
      source: [require("../../../../../assets/images/churches/eucharist-invitation-oil-painting.jpg")],
    });
    expect(screen.getByText("Find nearby Mass times")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Find churches near you" }));
    expect(mockPush).toHaveBeenCalledWith("/churches");
  });

  it("shows upcoming services with find and review actions in the card footer", async () => {
    mockGetSubscriptions.mockResolvedValue([
      {
        church,
        churchId: "church-1",
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);
    mockGetUpcoming.mockResolvedValue({
      data: [
        {
          churchId: "church-1",
          churchName: "St. Mary Cathedral",
          endsAt: null,
          id: "service-1",
          serviceType: "mass",
          startsAt: "2026-11-02T14:00:00.000Z",
          timezone: "America/Chicago",
        },
      ],
      meta: { hasMore: false, limit: 50, nextOffset: null, offset: 0 },
    });

    await render(<ChurchHomeSection now={new Date("2026-11-01T18:00:00.000Z")} />);

    expect(await screen.findByText("Upcoming church services")).toBeTruthy();
    expect(screen.getByText("Mass tomorrow at 8:00 AM")).toBeTruthy();
    expect(screen.getByText("St. Mary Cathedral")).toBeTruthy();
    expect(screen.getByTestId("church-upcoming-background").props).toMatchObject({
      accessible: false,
      contentFit: "cover",
      contentPosition: { right: 0, top: "50%" },
      source: [require("../../../../../assets/images/churches/eucharist-invitation-oil-painting.jpg")],
    });
    expect(screen.queryByTestId("church-invitation-background")).toBeNull();
    expect(screen.queryByText("Your church reminders")).toBeNull();
    expect(screen.queryByText("Update churches, service types, or reminder days.")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Find a church" }));
    expect(mockPush).toHaveBeenCalledWith("/churches");
  });

  it("labels tomorrow by church calendar date across a daylight-saving transition", async () => {
    mockGetSubscriptions.mockResolvedValue([
      {
        church,
        churchId: "church-1",
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);
    mockGetUpcoming.mockResolvedValue({
      data: [
        {
          churchId: "church-1",
          churchName: "St. Mary Cathedral",
          endsAt: null,
          id: "service-dst",
          serviceType: "mass",
          startsAt: "2026-11-02T14:00:00.000Z",
          timezone: "America/Chicago",
        },
      ],
      meta: { hasMore: false, limit: 50, nextOffset: null, offset: 0 },
    });

    await render(<ChurchHomeSection now={new Date("2026-11-01T05:30:00.000Z")} />);

    expect(await screen.findByText("Mass tomorrow at 8:00 AM")).toBeTruthy();
  });

  it("explains schedule verification when subscriptions have no ready schedule", async () => {
    mockGetSubscriptions.mockResolvedValue([
      {
        church: { ...church, scheduleStatus: "pending" },
        churchId: "church-1",
        notificationWeekdays: ["sunday"],
        scheduleReady: false,
        serviceTypes: ["mass"],
      },
    ]);

    await render(<ChurchHomeSection />);

    expect(await screen.findByText("We’re verifying this church’s schedule.")).toBeTruthy();
  });

  it("shows the seven-day empty state when subscribed schedules are ready", async () => {
    mockGetSubscriptions.mockResolvedValue([
      {
        church,
        churchId: "church-1",
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);

    await render(<ChurchHomeSection />);

    expect(await screen.findByText("No matching services are scheduled in the next seven days.")).toBeTruthy();
  });

  it("renders the invitation in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<ChurchHomeSection />);

    expect(await screen.findByRole("header", { name: "Él te espera" })).toBeTruthy();
    expect(screen.getByText("Visita a Jesús en el sagrario.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buscar iglesias cercanas" })).toBeTruthy();
  });

  it("labels the church-finder action in Spanish for subscribed users", async () => {
    await i18n.changeLanguage("es");
    mockGetSubscriptions.mockResolvedValue([
      {
        church,
        churchId: "church-1",
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);

    await render(<ChurchHomeSection />);

    expect(await screen.findByRole("button", { name: "Encuentra una iglesia" })).toBeTruthy();
  });

  it("offers a retry after the subscription request fails", async () => {
    mockGetSubscriptions.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce([]);
    await render(<ChurchHomeSection />);

    await waitFor(() => expect(screen.getByText("We couldn’t load your church reminders.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Try Again" }));
    expect(await screen.findByRole("header", { name: "He is waiting for you" })).toBeTruthy();
  });

  it("offers only the church finder on the subscribed card, with no reminder review action", async () => {
    mockGetSubscriptions.mockResolvedValue([
      { church, churchId: "church-1", notificationWeekdays: ["sunday"], scheduleReady: true, serviceTypes: ["mass"] },
    ]);
    await render(<ChurchHomeSection />);

    await screen.findByText("Upcoming church services");
    expect(screen.queryByRole("button", { name: "Review reminders" })).toBeNull();
    expect(screen.getByText("Find a church")).toHaveStyle({ color: theme.colors.text.white });
  });
});
