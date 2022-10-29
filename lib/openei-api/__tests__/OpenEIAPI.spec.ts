import { Decimal } from "@prisma/client/runtime";
import { openei, Response } from "../src/OpenEIAPI";

jest.setTimeout(20000);

describe("OpenEIAPI", () => {
  test("returns data", async () => {
    expect(await openei.get(32.9628, -117.0359)).toMatchObject<Response>({
      utility: "San Diego Gas & Electric Co",
      commercial: new Decimal(0.46083),
      residential: new Decimal(0.46083),
    });
  });
});
