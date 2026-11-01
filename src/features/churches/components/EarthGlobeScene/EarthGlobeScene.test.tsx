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
  it("completes exactly one rotation in eight seconds", () => {
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

  it("oversizes and offsets the globe so only the upper-right corner remains open", () => {
    const transform = getGlobeSceneTransform(1.8, 3);

    expect(transform.positionX).toBeCloseTo(-0.324);
    expect(transform.positionY).toBeCloseTo(-0.48);
    expect(transform.scale).toBeCloseTo(2.1239, 3);

    const cornerDistances = {
      bottomLeft: Math.hypot(-0.9 - transform.positionX, -1.5 - transform.positionY),
      bottomRight: Math.hypot(0.9 - transform.positionX, -1.5 - transform.positionY),
      topLeft: Math.hypot(-0.9 - transform.positionX, 1.5 - transform.positionY),
      topRight: Math.hypot(0.9 - transform.positionX, 1.5 - transform.positionY),
    };

    expect(cornerDistances.topRight).toBeGreaterThan(transform.scale);
    expect(cornerDistances.topLeft).toBeLessThan(transform.scale);
    expect(cornerDistances.bottomLeft).toBeLessThan(transform.scale);
    expect(cornerDistances.bottomRight).toBeLessThan(transform.scale);
  });

  it.each([
    [1.8, 3],
    [2.5, 2.5],
    [4, 2.2],
  ])("preserves the upper-right opening across a %.1f by %.1f responsive viewport", (width, height) => {
    const transform = getGlobeSceneTransform(width, height);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const distanceTo = (x: number, y: number) => Math.hypot(x - transform.positionX, y - transform.positionY);

    expect(distanceTo(halfWidth, halfHeight)).toBeGreaterThan(transform.scale);
    expect(distanceTo(-halfWidth, halfHeight)).toBeLessThan(transform.scale);
    expect(distanceTo(-halfWidth, -halfHeight)).toBeLessThan(transform.scale);
    expect(distanceTo(halfWidth, -halfHeight)).toBeLessThan(transform.scale);
  });
});
