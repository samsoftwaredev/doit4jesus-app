import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AppVisualEffectsProvider, APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY } from "@/theme/AppVisualEffectsProvider";

import { AtmosphericSafeAreaView } from "./atmospheric-safe-area-view";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;

describe("AtmosphericSafeAreaView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockImplementation(async (key) =>
      key === APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY
        ? JSON.stringify({ dustEnabled: true, lightingEnabled: true })
        : null,
    );
  });

  it("places the non-interactive atmosphere behind screen content", async () => {
    await render(
      <AppVisualEffectsProvider>
        <AtmosphericSafeAreaView>
          <Text>Protected screen content</Text>
        </AtmosphericSafeAreaView>
      </AppVisualEffectsProvider>,
    );

    expect(screen.getByTestId("sacred-atmosphere").props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(screen.getByText("Protected screen content")).toBeTruthy();
  });

  it("allows a gradient screen to provide its own correctly layered atmosphere", async () => {
    await render(
      <AppVisualEffectsProvider>
        <AtmosphericSafeAreaView includeAtmosphere={false}>
          <Text>Gradient screen content</Text>
        </AtmosphericSafeAreaView>
      </AppVisualEffectsProvider>,
    );

    expect(screen.queryByTestId("sacred-atmosphere")).toBeNull();
    expect(screen.getByTestId("sacred-atmosphere-foreground")).toBeTruthy();
    expect(screen.getByText("Gradient screen content")).toBeTruthy();
  });
});
