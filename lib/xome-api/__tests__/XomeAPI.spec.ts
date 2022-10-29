import { xome as XomeAPI } from "../src/XomeAPI";

describe("XomeAPI", () => {
  test("returns a dictionary of property facts", async () => {
    expect(
      await XomeAPI.getPropertyFacts("2221 soledad rancho road", "92109")
    ).toMatchObject({
      bedrooms: 3,
      bathsFull: 2,
      bathsHalf: 0,
      squareFeet: 1842,
      stories: 0,
      propertyType: "Single Family",
      county: "SAN DIEGO",
      lotSize: 8400,
      yearBuilt: 1971,
      pool: false,
      fireplace: false,
      construction: "",
      owner: "HALES ARLINE A TR (DCSD)",
      parcelNumber: "417-730-48-00",
      subjectZoning: "R-1:SINGLE FAM-RES",
      latitude: 32.81598,
      longitude: -117.23377,
      bathsTotal: 2,
      streetAddress: "2221 soledad rancho road",
      city: "San Diego",
      state: "CA",
      zip: "92109",
      evaluatedOn: null,
    });
  });

  test("returns a property value", async () => {
    expect(
      await XomeAPI.getPropertyValue(
        "2221 soledad rancho road",
        "san diego",
        "92109"
      )
    ).toEqual(expect.any(Number));
  });

  test("errors when a property doesn't exist", async () => {
    await expect(async () => {
      await XomeAPI.getPropertyValue("2221 example st", "example", "92109");
    }).rejects.toThrow("Value not found");
  });

  test("errors when a property value could not be found", async () => {
    await expect(async () => {
      await XomeAPI.getPropertyValue(
        "13100 danielson street",
        "poway",
        "92064"
      );
    }).rejects.toThrow("Value not found");
  });
});
