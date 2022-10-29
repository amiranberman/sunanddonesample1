import { sunroof } from "../src/SunroofAPI";

describe("SunroofAPI", () => {
  test("returns a sunnumber and roofspace for a valid location", async () => {
    expect(
      await sunroof.getDataByLatLng(32.8159841, -117.2338296)
    ).toMatchObject({
      sunnumber: expect.any(Number),
      roofspace: expect.any(Number),
    });
  });

  test("errors when an invalid location", async () => {
    await expect(async () => {
      await sunroof.getDataByLatLng(42.8159841, -117.2338296);
    }).rejects.toThrow("Sunnumber not found");
  });
});
