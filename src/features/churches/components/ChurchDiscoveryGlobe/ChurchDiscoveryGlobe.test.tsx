import type { ReactNode } from "react";
import { View } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { CHURCH_GLOBE_ROTATION_DURATION_MS, ChurchDiscoveryGlobe } from "./ChurchDiscoveryGlobe";

const reanimated = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
};
const mockUseAssets = jest.fn();

const mockCanvas = jest.fn(
  ({ children, frameloop, style }: { children: ReactNode; frameloop: string; style?: object }) => (
    <View accessibilityLabel={`globe-canvas-${frameloop}`} style={style} testID="church-globe-canvas">
      {children}
    </View>
  ),
);

jest.mock("expo-asset", () => ({
  useAssets: (...args: unknown[]) => mockUseAssets(...args),
}));

jest.mock(
  "@react-three/fiber/native",
  () => ({
    Canvas: (props: { children: ReactNode; frameloop: string; style?: object }) => mockCanvas(props),
  }),
  { virtual: true },
);

jest.mock(
  "../../church-globe-renderer",
  () => ({
    Canvas: (props: { children: ReactNode; frameloop: string; style?: object }) => mockCanvas(props),
  }),
  { virtual: true },
);

jest.mock(
  "../ChurchGlobeErrorBoundary",
  () => ({
    ChurchGlobeErrorBoundary: ({ children }: { children: ReactNode }) => children,
  }),
  { virtual: true },
);

jest.mock(
  "../EarthGlobeScene",
  () => ({
    EarthGlobeScene: ({
      reduceMotion,
      rotationDurationMs,
      textureUri,
    }: {
      reduceMotion: boolean;
      rotationDurationMs: number;
      textureUri: string;
    }) => {
      const { View: MockView } = jest.requireActual("react-native") as typeof import("react-native");
      return (
        <MockView
          accessibilityLabel={`earth-scene-${reduceMotion ? "static" : "animated"}-${rotationDurationMs}-${textureUri}`}
        />
      );
    },
  }),
  { virtual: true },
);

describe("ChurchDiscoveryGlobe", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    reanimated.useReducedMotion.mockReturnValue(true);
    mockUseAssets.mockReturnValue([
      [{ localUri: "file:///earth-realistic.jpg", uri: "https://example.test/earth.jpg" }],
    ]);
    await i18n.changeLanguage("en");
  });

  it("shows accessible ZIP-search guidance without animating for reduced motion", async () => {
    await render(<ChurchDiscoveryGlobe />);

    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.getByLabelText("globe-canvas-demand")).toBeTruthy();
    expect(screen.getByLabelText("earth-scene-static-16000-file:///earth-realistic.jpg")).toBeTruthy();
    expect(screen.getByText("Search by U.S. ZIP, church name, or address to explore churches.")).toBeTruthy();
  });

  it("uses a continuous noninteractive canvas when motion is allowed", async () => {
    reanimated.useReducedMotion.mockReturnValue(false);

    await render(<ChurchDiscoveryGlobe />);

    expect(screen.getByLabelText("globe-canvas-always")).toBeTruthy();
    expect(screen.getByLabelText("earth-scene-animated-16000-file:///earth-realistic.jpg")).toBeTruthy();
    expect(screen.getByTestId("church-globe-canvas")).toHaveStyle({ height: "100%", width: "100%" });
    expect(CHURCH_GLOBE_ROTATION_DURATION_MS).toBe(16_000);
  });

  it("uses the full panel for the 3D canvas without rendering a vector or static Earth fallback", async () => {
    await render(<ChurchDiscoveryGlobe />);

    expect(screen.queryByTestId("church-globe-static-fallback")).toBeNull();
    expect(screen.getByLabelText("earth-scene-static-16000-file:///earth-realistic.jpg")).toBeTruthy();
    expect(screen.getByTestId("church-globe-canvas")).toHaveStyle({ height: "100%", width: "100%" });
  });

  it("keeps a plain usable background when the Earth texture cannot load", async () => {
    mockUseAssets.mockReturnValue([undefined, new Error("texture unavailable")]);

    await render(<ChurchDiscoveryGlobe />);

    expect(screen.queryByTestId("church-globe-canvas")).toBeNull();
    expect(screen.queryByTestId("church-globe-static-fallback")).toBeNull();
    expect(screen.getByText("Search by U.S. ZIP, church name, or address to explore churches.")).toBeTruthy();
  });

  it("uses the bundled asset URI when the platform does not expose a local file URI", async () => {
    mockUseAssets.mockReturnValue([[{ localUri: null, uri: "https://example.test/earth.jpg" }]]);

    await render(<ChurchDiscoveryGlobe />);

    expect(screen.getByLabelText("earth-scene-static-16000-https://example.test/earth.jpg")).toBeTruthy();
  });

  it("renders the globe guidance in Spanish", async () => {
    await i18n.changeLanguage("es");

    await render(<ChurchDiscoveryGlobe />);

    expect(screen.getByLabelText("Globo para buscar iglesias")).toBeTruthy();
    expect(
      screen.getByText("Busca por código postal de EE. UU., iglesia o dirección para explorar iglesias."),
    ).toBeTruthy();
  });
});
