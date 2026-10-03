import { countriesWithFlags, filterCountriesWithFlags } from "./country-selector-data";

describe("country selector data", () => {
  it("includes every flag entry as a selectable country", () => {
    expect(countriesWithFlags).toHaveLength(255);
    expect(countriesWithFlags[0]).toMatchObject({ code: "US", name: "United States" });
    expect(countriesWithFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "US", name: "United States" }),
        expect.objectContaining({ code: "GB-ENG", name: "England" }),
        expect.objectContaining({ code: "XK", name: "Kosovo" }),
      ]),
    );
  });

  it("searches the complete flag catalog by country name or code", () => {
    expect(filterCountriesWithFlags("united").map((country) => country.code)).toEqual(["AE", "GB", "US"]);
    expect(filterCountriesWithFlags("united states")).toEqual([
      expect.objectContaining({ code: "US", name: "United States" }),
    ]);
    expect(filterCountriesWithFlags("gb-eng")).toEqual([expect.objectContaining({ code: "GB-ENG", name: "England" })]);
  });
});
