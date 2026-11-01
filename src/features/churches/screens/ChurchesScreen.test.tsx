/* eslint-disable @typescript-eslint/no-require-imports -- Jest mocks load React Native components lazily. */
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ChurchesScreen } from "./ChurchesScreen";

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockQueueAchievement = jest.fn();
const mockResolvePostalCode = jest.fn();
const mockSearchChurches = jest.fn();
const mockGetChurchDetails = jest.fn();
const mockGetSubscriptions = jest.fn();
const mockCreateSubscription = jest.fn();
const mockUpdateSubscription = jest.fn();
const mockDeleteSubscription = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

jest.mock("@/features/achievements", () => ({
  useAchievement: () => ({ queueAchievement: mockQueueAchievement }),
}));

jest.mock("../churches.api", () => ({
  ChurchApiError: class ChurchApiError extends Error {},
  createChurchSubscription: (...args: unknown[]) => mockCreateSubscription(...args),
  deleteChurchSubscription: (...args: unknown[]) => mockDeleteSubscription(...args),
  getChurchDetails: (...args: unknown[]) => mockGetChurchDetails(...args),
  getChurchSubscriptions: (...args: unknown[]) => mockGetSubscriptions(...args),
  resolvePostalCode: (...args: unknown[]) => mockResolvePostalCode(...args),
  searchChurches: (...args: unknown[]) => mockSearchChurches(...args),
  updateChurchSubscription: (...args: unknown[]) => mockUpdateSubscription(...args),
}));

jest.mock("../components", () => ({
  ChurchDiscoveryGlobe: () => {
    const { Text, View } = require("react-native");
    return (
      <View accessibilityLabel="Church discovery globe">
        <Text>Search by U.S. ZIP, church name, or address to explore churches.</Text>
      </View>
    );
  },
  ChurchMap: ({
    markers,
    onSelectChurch,
  }: {
    markers: { id: string; name: string }[];
    onSelectChurch: (id: string) => void;
  }) => {
    const { Pressable, Text, View } = require("react-native");
    return (
      <View accessibilityLabel="Church results map">
        {markers.map((marker) => (
          <Pressable
            accessibilityLabel={`Map marker ${marker.name}`}
            accessibilityRole="button"
            key={marker.id}
            onPress={() => onSelectChurch(marker.id)}
          >
            <Text>{marker.name}</Text>
          </Pressable>
        ))}
      </View>
    );
  },
  ChurchSearchToolbar: ({
    canShowMap,
    errorMessage,
    hasSearched,
    onApplyFilters,
    onChangeText,
    onSearch,
    onViewChange,
    resolvedPostalCode,
    searchTerm,
    view,
  }: {
    canShowMap: boolean;
    errorMessage: string | null;
    hasSearched: boolean;
    onApplyFilters: (filters: { city: string; dioceseId: string }) => void;
    onChangeText: (value: string) => void;
    onSearch: () => void;
    onViewChange: (view: "list" | "map") => void;
    resolvedPostalCode: Record<string, unknown> | null;
    searchTerm: string;
    view: "list" | "map";
  }) => {
    const { Pressable, Text, TextInput, View } = require("react-native");
    const { useTranslation } = require("react-i18next");
    const { t } = useTranslation();
    return (
      <View>
        <TextInput
          accessibilityLabel={t("churches.search.unifiedLabel")}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          value={searchTerm}
        />
        <Text>{t("churches.search.usOnly")}</Text>
        <Pressable accessibilityLabel={t("churches.search.action")} accessibilityRole="button" onPress={onSearch} />
        <Pressable
          accessibilityLabel={t("churches.filters.open")}
          accessibilityRole="button"
          accessibilityState={{ disabled: !resolvedPostalCode }}
          disabled={!resolvedPostalCode}
        />
        <Pressable
          accessibilityLabel={t(view === "map" ? "churches.results.showList" : "churches.results.showMap")}
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasSearched || (view === "list" && !canShowMap) }}
          disabled={!hasSearched || (view === "list" && !canShowMap)}
          onPress={() => onViewChange(view === "map" ? "list" : "map")}
        />
        {resolvedPostalCode ? (
          <Pressable
            accessibilityLabel="Apply Austin filters"
            accessibilityRole="button"
            onPress={() => onApplyFilters({ city: "Austin", dioceseId: "diocese-austin" })}
          />
        ) : null}
        {errorMessage ? <Text accessibilityRole="alert">{errorMessage}</Text> : null}
      </View>
    );
  },
  ChurchResultsSheet: ({ children, summary, title }: { children: React.ReactNode; summary: string; title: string }) => {
    const { Text, View } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        <Text>{summary}</Text>
        {children}
      </View>
    );
  },
}));

const church = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  dioceseId: "diocese-austin",
  dioceseName: "Diocese of Austin",
  directoryVerificationStatus: "verified" as const,
  distanceMiles: 1.4,
  id: "church-1",
  latitude: 30.273,
  longitude: -97.739,
  name: "St. Mary Cathedral",
  postalCode: "78701",
  regionName: "Texas",
  scheduleStatus: "verified" as const,
  timezone: "America/Chicago",
};

const details = {
  ...church,
  isActive: true,
  liveStatus: { adorationInProgress: false, confessionInProgress: false, massInProgress: false },
  serviceTimes: [],
};

const resolvedPostalCode = {
  cities: [
    {
      isPrimary: true,
      label: "Austin city",
      name: "Austin",
      overlapPercent: 99.5,
      regionCode: "TX",
      status: "current_census_place",
    },
    {
      isPrimary: false,
      label: "West Lake Hills city",
      name: "West Lake Hills",
      overlapPercent: 0.5,
      regionCode: "TX",
      status: "current_census_place",
    },
  ],
  dioceseStatus: "approximate_centroid",
  dioceses: [{ id: "diocese-austin", matchStatus: "approximate_centroid", name: "Diocese of Austin" }],
  latitude: 30.2672,
  longitude: -97.7431,
  postalCode: "78701",
  primaryCity: "Austin",
  regionCodes: ["TX"],
  timezone: "America/Chicago",
};

const emptyPage = { data: [], meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 } };
const churchPage = { data: [church], meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 } };

describe("ChurchesScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
    mockGetSubscriptions.mockResolvedValue([]);
    mockResolvePostalCode.mockResolvedValue(resolvedPostalCode);
    mockSearchChurches.mockResolvedValue(emptyPage);
    mockGetChurchDetails.mockResolvedValue(details);
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

  it("validates incomplete ZIP input before making a request", async () => {
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "787");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid five-digit ZIP code.");
    expect(mockResolvePostalCode).not.toHaveBeenCalled();
  });

  it("requires a nonempty unified search term", async () => {
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a five-digit U.S. ZIP, church name, or address.");
    expect(mockResolvePostalCode).not.toHaveBeenCalled();
    expect(mockSearchChurches).not.toHaveBeenCalled();
  });

  it("keeps the globe until a submitted ZIP search replaces it with the full map", async () => {
    await render(<ChurchesScreen />);

    expect((await screen.findByRole("tab", { name: "Find a church" })).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByRole("tab", { name: "Review reminders" }).props.accessibilityState).toEqual({
      selected: false,
    });
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.queryByLabelText("Church results map")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    expect(await screen.findByLabelText("Church results map")).toBeTruthy();
    expect(screen.queryByLabelText("Church discovery globe")).toBeNull();
  });

  it("clears stale map and result state when a submitted term is edited", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    const searchInput = screen.getByLabelText("Search by ZIP, church name, or address");
    await fireEvent.changeText(searchInput, "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    expect(await screen.findByLabelText("Church results map")).toBeTruthy();

    await fireEvent.changeText(searchInput, "St. Mary");
    expect(screen.queryByLabelText("Church results map")).toBeNull();
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.queryByText("Nearby churches")).toBeNull();
  });

  it("resolves a ZIP, searches with its filters, and toggles between map and list", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    await waitFor(() => expect(mockResolvePostalCode).toHaveBeenCalledWith("78701"));
    expect(mockSearchChurches).toHaveBeenCalledWith(
      expect.objectContaining({ country: "US", limit: 20, offset: 0, postalCode: "78701", radiusMiles: 25 }),
    );
    expect(await screen.findByLabelText("Church results map")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Show church list" }));
    expect(screen.getAllByText("St. Mary Cathedral").length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByRole("button", { name: "View St. Mary Cathedral details" }));
    expect(mockGetChurchDetails).toHaveBeenCalledWith("church-1");
    expect(await screen.findByRole("button", { name: "Add church" })).toBeTruthy();
  });

  it("passes selected city and diocese filters back to the server", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Apply Austin filters" }));

    expect(mockSearchChurches).toHaveBeenLastCalledWith(
      expect.objectContaining({ city: "Austin", dioceseId: "diocese-austin", postalCode: "78701" }),
    );
  });

  it("shows recurring schedule and live status from the shared church preview", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    mockGetChurchDetails.mockResolvedValue({
      ...details,
      liveStatus: { ...details.liveStatus, massInProgress: true },
      serviceTimes: [{ endTime: "09:00", id: "service-1", serviceType: "mass", startTime: "08:00", weekday: "sunday" }],
    });
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Map marker St. Mary Cathedral" }));

    expect(await screen.findByText("Mass is in progress")).toBeTruthy();
    expect(screen.getByText("Sunday · Mass · 8:00 AM")).toBeTruthy();
  });

  it("supports name or address search without resolving a ZIP", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "Cathedral");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    await waitFor(() =>
      expect(mockSearchChurches).toHaveBeenCalledWith({ country: "US", limit: 20, offset: 0, q: "Cathedral" }),
    );
    expect(mockResolvePostalCode).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.getByText("St. Mary Cathedral")).toBeTruthy();
  });

  it("preserves U.S. query classification when loading another result page", async () => {
    mockSearchChurches
      .mockResolvedValueOnce({ data: [church], meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 } })
      .mockResolvedValueOnce(emptyPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "Cathedral");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Load more churches" }));

    await waitFor(() => expect(mockSearchChurches).toHaveBeenCalledTimes(2));
    expect(mockSearchChurches).toHaveBeenLastCalledWith({
      country: "US",
      limit: 20,
      offset: 20,
      q: "Cathedral",
    });
  });

  it("treats a numeric-leading street address as a query and can map its coordinates", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "203 E 10th St Austin");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    await waitFor(() =>
      expect(mockSearchChurches).toHaveBeenCalledWith({
        country: "US",
        limit: 20,
        offset: 0,
        q: "203 E 10th St Austin",
      }),
    );
    expect(mockResolvePostalCode).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Show church map" }));
    expect(screen.getByLabelText("Church results map")).toBeTruthy();
  });

  it("opens an empty Review reminders tab and returns to church discovery", async () => {
    await render(<ChurchesScreen />);
    await screen.findByRole("tab", { name: "Find a church" });

    await fireEvent.press(screen.getByRole("tab", { name: "Review reminders" }));

    expect(screen.getByText("Select at least one church before reviewing reminders.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Back to church search" }));
    expect(screen.getByRole("tab", { name: "Find a church" }).props.accessibilityState).toEqual({ selected: true });
  });

  it("completes first-time setup only after a service and weekday are selected", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Map marker St. Mary Cathedral" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Add church" }));
    await fireEvent.press(screen.getByRole("tab", { name: "Review reminders" }));
    await fireEvent.press(screen.getByRole("button", { name: "Complete setup" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose at least one service and one reminder day for every selected church.",
    );

    await fireEvent.press(screen.getByRole("checkbox", { name: "Mass" }));
    await fireEvent.press(screen.getByRole("checkbox", { name: "Sunday" }));
    await fireEvent.press(screen.getByRole("button", { name: "Complete setup" }));

    await waitFor(() =>
      expect(mockCreateSubscription).toHaveBeenCalledWith({
        churchId: "church-1",
        notificationWeekdays: ["sunday"],
        serviceTypes: ["mass"],
      }),
    );
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "church-reminders-configured" });
    expect(mockReplace).toHaveBeenCalledWith("/home");
  });

  it("enforces the three-church selection limit", async () => {
    const existing = [1, 2, 3].map((number) => ({
      church: { ...church, id: `existing-${number}`, name: `Existing ${number}` },
      churchId: `existing-${number}`,
      notificationWeekdays: ["sunday"],
      scheduleReady: true,
      serviceTypes: ["mass"],
    }));
    mockGetSubscriptions.mockResolvedValue(existing);
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Map marker St. Mary Cathedral" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Add church" }));

    expect(screen.getByRole("alert")).toHaveTextContent("You can follow up to three churches.");
  });

  it("retries only failed church mutations and reports each failed church", async () => {
    const secondChurch = { ...church, id: "church-2", name: "St. Austin" };
    mockGetSubscriptions.mockResolvedValue([
      {
        church,
        churchId: church.id,
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
      {
        church: secondChurch,
        churchId: secondChurch.id,
        notificationWeekdays: ["sunday"],
        scheduleReady: true,
        serviceTypes: ["mass"],
      },
    ]);
    mockUpdateSubscription.mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    await render(<ChurchesScreen />);
    await screen.findByText("Find a church");
    await fireEvent.press(screen.getByRole("tab", { name: "Review reminders" }));
    for (const checkbox of screen.getAllByRole("checkbox", { name: "Confession" })) {
      await fireEvent.press(checkbox);
    }
    await fireEvent.press(screen.getByRole("button", { name: "Complete setup" }));

    expect(
      await screen.findByText(
        "St. Mary Cathedral: Some church reminders couldn’t be saved. Retry the remaining changes.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry remaining changes" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry remaining changes" }));

    await waitFor(() => expect(mockUpdateSubscription).toHaveBeenCalledTimes(3));
    expect(mockUpdateSubscription.mock.calls.map(([churchId]) => churchId)).toEqual([
      "church-1",
      "church-2",
      "church-1",
    ]);
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "church-reminders-updated" });
    expect(mockReplace).toHaveBeenCalledWith("/home");
  });

  it("renders the discovery heading in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<ChurchesScreen />);
    expect(await screen.findByText("Encuentra una iglesia")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buscar iglesias" })).toBeTruthy();
    expect(screen.getByText("Solo EE. UU.")).toBeTruthy();
  });
});
