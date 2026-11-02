import {
  EARTH_AXIAL_TILT_RADIANS,
  EARTH_INITIAL_Y_ROTATION_RADIANS,
  getGlobeSceneTransform,
  getNextEarthRotation,
} from "./EarthGlobeScene";

jest.mock(
  "@react-three/fiber/native",
  () => ({
    useFrame: jest.fn(),
    useLoader: jest.fn(() => ({ colorSpace: "" })),
    useThree: jest.fn((selector: (state: { invalidate: jest.Mock }) => unknown) => selector({ invalidate: jest.fn() })),
  }),
  { virtual: true },
);

jest.mock(
  "../../church-globe-renderer",
  () => ({
    useFrame: jest.fn(),
    useLoader: jest.fn(() => ({ colorSpace: "" })),
    useThree: jest.fn((selector: (state: { invalidate: jest.Mock }) => unknown) => selector({ invalidate: jest.fn() })),
  }),
  { virtual: true },
);

jest.mock(
  "three",
  () => ({
    AdditiveBlending: 2,
    Color: class Color {},
    DoubleSide: 2,
    Group: class Group {},
    MathUtils: { degToRad: (degrees: number) => (degrees * Math.PI) / 180 },
    Points: class Points {},
    SRGBColorSpace: "srgb",
    TextureLoader: class TextureLoader {},
  }),
  { virtual: true },
);

describe("EarthGlobeScene", () => {
  it("completes exactly one rotation in sixteen seconds", () => {
    expect(getNextEarthRotation(EARTH_INITIAL_Y_ROTATION_RADIANS, 16, 16_000, false)).toBeCloseTo(
      EARTH_INITIAL_Y_ROTATION_RADIANS + Math.PI * 2,
    );
  });

  it("does not rotate when reduced motion is enabled", () => {
    expect(getNextEarthRotation(EARTH_INITIAL_Y_ROTATION_RADIANS, 4, 16_000, true)).toBe(
      EARTH_INITIAL_Y_ROTATION_RADIANS,
    );
  });

  it("starts with North America oriented toward the camera", () => {
    expect(EARTH_INITIAL_Y_ROTATION_RADIANS).toBeCloseTo(Math.PI / 6);
  });

  it("uses Earth's axial tilt", () => {
    expect(EARTH_AXIAL_TILT_RADIANS).toBeCloseTo((23.4 * Math.PI) / 180);
  });

  it("places the globe center on the bottom edge so only its upper semicircle occupies the lower half", () => {
    const transform = getGlobeSceneTransform(1.8, 3);

    expect(transform.positionX).toBe(0);
    expect(transform.positionY).toBeCloseTo(-1.5);
    expect(transform.scale).toBeCloseTo(1.5);
    expect(transform.positionY + transform.scale).toBeCloseTo(0);
  });

  it.each([
    [1.8, 3],
    [2.5, 2.5],
    [4, 2.2],
  ])("preserves the lower-half semicircle across a %.1f by %.1f responsive viewport", (width, height) => {
    const transform = getGlobeSceneTransform(width, height);
    const halfHeight = height / 2;

    expect(transform.positionX).toBe(0);
    expect(transform.positionY).toBeCloseTo(-halfHeight);
    expect(transform.scale).toBeCloseTo(halfHeight);
    expect(transform.positionY + transform.scale).toBeCloseTo(0);
    expect(transform.positionY - transform.scale).toBeCloseTo(-height);
  });
});
