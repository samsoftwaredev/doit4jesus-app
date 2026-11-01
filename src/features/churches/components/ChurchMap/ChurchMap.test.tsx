import { createChurchMarkerLabel, getChurchMapBounds } from "../../churches.map";

const markers = [
  { address: "203 E 10th St, Austin", id: "church-1", latitude: 30.27, longitude: -97.74, name: "St. Mary" },
  { address: "201 E Mary St, Austin", id: "church-2", latitude: 30.25, longitude: -97.75, name: "St. Ignatius" },
];

describe("ChurchMap", () => {
  it("bundles Leaflet CSS statically instead of loading it as a runtime module", () => {
    const { readFileSync } = jest.requireActual("fs") as {
      readFileSync: (path: string, encoding: string) => string;
    };
    const { dirname, join } = jest.requireActual("path") as {
      dirname: (path: string) => string;
      join: (...paths: string[]) => string;
    };
    const testPath = expect.getState().testPath;
    if (!testPath) throw new Error("Jest did not expose the ChurchMap test path.");
    const source = readFileSync(join(dirname(testPath), "ChurchMap.tsx"), "utf8");

    expect(source).toContain('import "leaflet/dist/leaflet.css";');
    expect(source).not.toContain('await import("leaflet/dist/leaflet.css")');
  });

  it("builds a descriptive accessible marker label", () => {
    expect(createChurchMarkerLabel(markers[0]!)).toBe("St. Mary, 203 E 10th St, Austin");
  });

  it("derives bounds that include every result and falls back to the search center", () => {
    expect(getChurchMapBounds(markers, { latitude: 30.26, longitude: -97.74 })).toEqual([
      [30.25, -97.75],
      [30.27, -97.74],
    ]);
    expect(getChurchMapBounds([], { latitude: 30.26, longitude: -97.74 })).toEqual([
      [30.26, -97.74],
      [30.26, -97.74],
    ]);
  });
});
