import { EnergySageAPI, Response } from "../src/EnergySageAPI";

jest.setTimeout(20000);

let energysage: EnergySageAPI;

afterEach(async () => {
  await energysage.closeBrowser();
});

beforeEach(async () => {
  energysage = new EnergySageAPI({ headless: false });
});

describe("EnergySageAPI", () => {
  test("returns panel data when given a url", async () => {
    expect(
      // await energysage.getPanel("REC N Peak 2 Black Series 365W")
      await energysage.getPanel(
        "url",
        "https://www.energysage.com/solar-panels/silfab-solar/2678/sil-370-hc/"
      )
    ).toMatchObject<Response>({
      // {
      //   wattage: 400,
      //   name: 'Q CELLS Q.PEAK DUO BLK ML-G10+ 400',
      //   efficiency: 0.204,
      //   rating: 5,
      //   degradation: 0.005,
      //   output25: 0.86,
      //   warranty: 25,
      //   imagePanel: 'https://res.cloudinary.com/energysage/image/fetch/s--ku9C5b1---/c_limit,f_auto,q_auto/https://es-media-prod.s3.amazonaws.com/media/components/panels/images/desktop/desktop_Q_CELLS_Q.PEAK_DUO_BLK-G8_front.jpg',
      //   imageMounted: null,
      //   ppwMarket: 3.56,
      //   material: 'Monocrystalline',
      //   manufacturer: 'Q CELLS',
      //   energySageLink: 'https://www.energysage.com/solar-panels/q-cells/2674/duo-blk-ml-g10-400/',
      //   countries: [ 'South Korea', 'United States' ],
      //   colors: { backsheet: 'white', cell: 'black', frame: 'black' },
      //   dimensions: { length: 1879, width: 1045, depth: 32 }
      // }
      model: expect.any(String),
      wattage: expect.any(Number),
      efficiency: expect.any(Number),
      rating: expect.any(Number),
      degradation: expect.any(Number),
      output25: expect.any(Number),
      warranty: expect.any(Number),
      productImage: expect.any(String),
      ppwMarket: expect.any(Number),
      material: expect.any(String),
      manufacturer: expect.any(String),
      energySageLink: expect.any(String),
      countries: expect.arrayContaining([
        expect.objectContaining({ name: expect.any(String) }),
      ]),
      colors: expect.objectContaining({
        backsheet: expect.any(String),
        cell: expect.any(String),
        frame: expect.any(String),
      }),
      dimensions: expect.objectContaining({
        length: expect.any(Number),
        width: expect.any(Number),
        depth: expect.any(Number),
      }),
    });
  });
  test("returns panel data when given a name", async () => {
    expect(
      // await energysage.getPanel("REC N Peak 2 Black Series 365W")
      await energysage.getPanel("search", "Q CELLS Q.PEAK DUO BLK ML-G10+ 400")
    ).toMatchObject<Response>({
      // {
      //   wattage: 400,
      //   name: 'Q CELLS Q.PEAK DUO BLK ML-G10+ 400',
      //   efficiency: 0.204,
      //   rating: 5,
      //   degradation: 0.005,
      //   output25: 0.86,
      //   warranty: 25,
      //   imagePanel: 'https://res.cloudinary.com/energysage/image/fetch/s--ku9C5b1---/c_limit,f_auto,q_auto/https://es-media-prod.s3.amazonaws.com/media/components/panels/images/desktop/desktop_Q_CELLS_Q.PEAK_DUO_BLK-G8_front.jpg',
      //   imageMounted: null,
      //   ppwMarket: 3.56,
      //   material: 'Monocrystalline',
      //   manufacturer: 'Q CELLS',
      //   energySageLink: 'https://www.energysage.com/solar-panels/q-cells/2674/duo-blk-ml-g10-400/',
      //   countries: [ 'South Korea', 'United States' ],
      //   colors: { backsheet: 'white', cell: 'black', frame: 'black' },
      //   dimensions: { length: 1879, width: 1045, depth: 32 }
      // }
      model: expect.any(String),
      wattage: expect.any(Number),
      efficiency: expect.any(Number),
      rating: expect.any(Number),
      degradation: expect.any(Number),
      output25: expect.any(Number),
      warranty: expect.any(Number),
      productImage: expect.any(String),
      ppwMarket: expect.any(Number),
      material: expect.any(String),
      manufacturer: expect.any(String),
      energySageLink: expect.any(String),
      countries: expect.arrayContaining([
        expect.objectContaining({ name: expect.any(String) }),
      ]),
      colors: expect.objectContaining({
        backsheet: expect.any(String),
        cell: expect.any(String),
        frame: expect.any(String),
      }),
      dimensions: expect.objectContaining({
        length: expect.any(Number),
        width: expect.any(Number),
        depth: expect.any(Number),
      }),
    });
  });
});
