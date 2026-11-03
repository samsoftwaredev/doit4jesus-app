/* eslint-disable @typescript-eslint/no-require-imports -- Jest mocks load React Native components lazily. */
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ChurchesScreen } from "./ChurchesScreen";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockResolvePostalCode = jest.fn();
const mockSearchChurches = jest.fn();
const mockGetChurchDetails = jest.fn();
const mockToggleSelectedChurch = jest.fn();
const mockClearError = jest.fn();
let mockSetup: Record<string, unknown>;

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack, push: mockPush }) }));
jest.mock("react-native-safe-area-context", () => ({
  ...jest.requireActual<typeof import("react-native-safe-area-context")>("react-native-safe-area-context"),
  useSafeAreaInsets: () => ({ bottom: 24, left: 0, right: 0, top: 0 }),
}));
jest.mock("../churches.api", () => ({
  ChurchApiError: class ChurchApiError extends Error {},
  getChurchDetails: (...args: unknown[]) => mockGetChurchDetails(...args),
  resolvePostalCode: (...args: unknown[]) => mockResolvePostalCode(...args),
  searchChurches: (...args: unknown[]) => mockSearchChurches(...args),
}));
jest.mock("../components", () => ({
  ChurchDiscoveryGlobe: () => {
    const { Text, View } = require("react-native");
    return (
      <View accessibilityLabel="Church discovery globe">
        <Text>3D globe</Text>
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
    onChangeText,
    onSearch,
    onViewChange,
    searchTerm,
    view,
  }: {
    canShowMap: boolean;
    errorMessage: string | null;
    hasSearched: boolean;
    onChangeText: (value: string) => void;
    onSearch: () => void;
    onViewChange: (view: "list" | "map") => void;
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
        {hasSearched ? (
          <Pressable
            accessibilityLabel={t(view === "map" ? "churches.results.showList" : "churches.results.showMap")}
            accessibilityRole="button"
            disabled={view === "list" && !canShowMap}
            onPress={() => onViewChange(view === "map" ? "list" : "map")}
          />
        ) : null}
        {errorMessage ? <Text accessibilityRole="alert">{errorMessage}</Text> : null}
      </View>
    );
  },
  ChurchResultsSheet: ({
    bottomInset,
    children,
    overlaysControls,
    summary,
    title,
  }: {
    bottomInset: number;
    children: React.ReactNode;
    overlaysControls?: boolean;
    summary: string;
    title: string;
  }) => {
    const { Text, View } = require("react-native");
    return (
      <View testID="church-results-sheet">
        <Text>{`bottom:${bottomInset}`}</Text>
        <Text>{title}</Text>
        <Text>{summary}</Text>
        <Text>{overlaysControls ? "detail overlay" : "standard results"}</Text>
        {children}
      </View>
    );
  },
  useChurchReminderSetup: () => mockSetup,
}));

const church = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  dioceseId: null,
  dioceseName: null,
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
const location = {
  cities: [],
  dioceseStatus: "approximate_centroid",
  dioceses: [],
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
    mockSetup = {
      clearError: mockClearError,
      drafts: [],
      errorMessage: null,
      existingSubscriptions: [],
      isLoadingSubscriptions: false,
      selectedChurchIds: new Set(),
      toggleSelectedChurch: mockToggleSelectedChurch,
    };
    mockResolvePostalCode.mockResolvedValue(location);
    mockSearchChurches.mockResolvedValue(emptyPage);
    mockGetChurchDetails.mockResolvedValue(details);
  });

  it("renders full-screen discovery without tabs, frame, or filters", async () => {
    await render(<ChurchesScreen />);
    expect(screen.getByTestId("church-discovery-page")).toBeTruthy();
    expect(screen.getByTestId("church-discovery-background")).toBeTruthy();
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.queryByLabelText("Open church filters")).toBeNull();
  });

  it("validates incomplete numeric ZIP input without making a request", async () => {
    await render(<ChurchesScreen />);
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "787");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid five-digit ZIP code.");
    expect(mockResolvePostalCode).not.toHaveBeenCalled();
  });

  it("replaces the globe with a full map only after a submitted ZIP search", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    const input = screen.getByLabelText("Search by ZIP, church name, or address");
    await fireEvent.changeText(input, "78701");
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    expect(await screen.findByLabelText("Church results map")).toBeTruthy();
    expect(mockSearchChurches).toHaveBeenCalledWith({
      country: "US",
      limit: 20,
      offset: 0,
      postalCode: "78701",
      radiusMiles: 25,
    });
  });

  it("keeps query search on the globe, lists results, and can toggle to their map", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "203 E 10th St");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await waitFor(() =>
      expect(mockSearchChurches).toHaveBeenCalledWith({ country: "US", limit: 20, offset: 0, q: "203 E 10th St" }),
    );
    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.getByText("St. Mary Cathedral")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Show church map" }));
    expect(screen.getByLabelText("Church results map")).toBeTruthy();
  });

  it("selects the same church from a map marker and retains its draft in the bottom action", async () => {
    mockSearchChurches.mockResolvedValue(churchPage);
    await render(<ChurchesScreen />);
    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "78701");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Map marker St. Mary Cathedral" }));
    expect(await screen.findByText("detail overlay")).toBeTruthy();
    await fireEvent.press(await screen.findByRole("button", { name: "Add church" }));
    expect(mockToggleSelectedChurch).toHaveBeenCalledWith(details);
  });

  it("uses a disabled first-time action until a church is selected", async () => {
    const { rerender } = await render(<ChurchesScreen />);
    expect(screen.getByRole("button", { name: "Next: Set reminders" }).props.accessibilityState.disabled).toBe(true);
    mockSetup = {
      ...mockSetup,
      drafts: [{ church, notificationWeekdays: [], serviceTypes: [] }],
      selectedChurchIds: new Set([church.id]),
    };
    await rerender(<ChurchesScreen />);
    const next = screen.getByRole("button", { name: "Next: Set reminders" });
    expect(next.props.accessibilityState.disabled).toBe(false);
    await fireEvent.press(next);
    expect(mockPush).toHaveBeenCalledWith("/churches/reminders");
  });

  it("keeps Review reminders enabled when an existing subscription is removed from drafts", async () => {
    mockSetup = {
      ...mockSetup,
      existingSubscriptions: [
        { church, churchId: church.id, notificationWeekdays: ["sunday"], scheduleReady: true, serviceTypes: ["mass"] },
      ],
    };
    await render(<ChurchesScreen />);
    const review = screen.getByRole("button", { name: "Review reminders" });
    expect(review.props.accessibilityState.disabled).toBe(false);
    await fireEvent.press(review);
    expect(mockPush).toHaveBeenCalledWith("/churches/reminders");
  });

  it("renders discovery and its bottom action in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<ChurchesScreen />);
    expect(screen.getByText("Encuentra una iglesia")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Siguiente: configurar recordatorios" })).toBeTruthy();
  });
});
