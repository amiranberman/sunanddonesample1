import {
  BrowserContext,
  chromium,
  ChromiumBrowser,
  LaunchOptions,
  Page,
} from "playwright";
import { CompleteSolarPanel } from "@sunanddone/prisma";

const URL = "https://www.energysage.com";

enum Rating {
  "Poor" = 1,
  "Fair" = 2,
  "Good" = 3,
  "Very Good" = 4,
  "Excellent" = 5,
}

export interface Response
  extends Omit<
    CompleteSolarPanel,
    "id" | "solarPanelColorsId" | "images" | "installers"
  > {}
export class EnergySageAPI {
  private browser: Promise<ChromiumBrowser>;
  private context: Promise<BrowserContext>;

  constructor(options?: LaunchOptions) {
    this.browser = chromium.launch(options);
    this.context = this.browser.then((browser) => browser.newContext());
  }

  private extractText(
    name: string,
    text: string | null,
    selector: RegExp = /(.+)/
  ): string {
    if (!text) throw Error(`${name} not found on page`);
    let value = text.trim().match(selector);
    if (!value || !value[1]) throw Error(`${name} value not matched`);
    return value[1];
  }

  async search(query: string, page: Page) {
    await page.goto(URL + "/solar-panels");
    // await page.locator('[placeholder="Search solar panels"]').click();
    await page.locator('[placeholder="Search solar panels"]').fill(query);
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button:has-text("Search")').click(),
    ]);

    try {
      await Promise.all([
        page.waitForNavigation(),
        page.locator(`text=${query} >> nth=0`).click(),
      ]);
    } catch {
      console.error(query);
    }
  }

  async getPanel(method: "url" | "search", query: string): Promise<Response> {
    const context = await this.context;
    const page = await context.newPage();
    // page.setDefaultTimeout(10000);
    if (method === "search") {
      await this.search(query, page);
    } else if (method === "url") {
      await page.goto(query);
    }

    let series: string = "";
    let model: string = "";
    try {
      const details = await page
        .locator("h1 >> nth=0")
        .textContent()
        .then((text) => text!.split("\n").map((item) => item.trim()));
      series = details[2] as string;
      model = details[4] as string;
    } catch {}

    const wattage = await page
      .locator(':text("Rated Power") + div >> nth=0')
      .textContent()
      .then((text) => parseInt(this.extractText("wattage", text, /(.+)W/)));

    const efficiency = await page
      .locator(':text("Efficiency") + div >> nth=0')
      .textContent()
      .then(
        (text) =>
          +(+this.extractText("efficiency", text, /(.+)%/) / 100.0).toFixed(3)
      );

    // const degradation = await page
    //   .locator(':text("Output Decline") + div >> nth=0')
    //   .textContent()
    //   .then(
    //     (text) =>
    //       parseFloat(this.extractText("degredation", text, /.+%\n(.+)%/)) /
    //       100.0
    //   );
    const degradation = 1;

    const output25 = await page
      .locator(':text("Output at End of Warranty Term") + div >> nth=0')
      .textContent()
      .then(
        (text) =>
          +(+this.extractText("output25", text, /(.+)%/) / 100.0).toFixed(3)
      );

    const warranty = await page
      .locator(':text("Output Warranty Term") + div >> nth=0')
      .textContent()
      .then((text) =>
        parseInt(this.extractText("warranty", text, /(.+) year/))
      );

    const material = await page
      .locator(':text("Cell Type") + div >> nth=0')
      .textContent()
      .then((text) => this.extractText("material", text));

    const manufacturer = await page
      .locator('a[href*="/supplier"] h2 >> nth=0')
      .textContent()
      .then((text) => this.extractText("manufacturer", text));

    const energySageLink = page.url();

    const colors = {
      backsheet: await page
        .locator(':text("Backsheet Colors") + div >> nth=0')
        .textContent()
        .then((text) => this.extractText("backsheet color", text)),
      cell: await page
        .locator(':text("Cell Colors") + div >> nth=0')
        .textContent()
        .then((text) => this.extractText("cell color", text)),
      frame: await page
        .locator(':text("Frame Colors") + div >> nth=0')
        .textContent()
        .then((text) => this.extractText("frame color", text)),
    } as Response["colors"];

    let dimensions;
    try {
      dimensions = (await page
        .locator(':text("Panel Dimensions") + div >> nth=0')
        .textContent()
        .then((text) => ({
          length: parseFloat(this.extractText("length", text, /(.+) mm L/)),
          width: parseFloat(this.extractText("width", text, /(.+) mm W/)),
          depth: parseFloat(this.extractText("depth", text, /(.+) mm D/)),
        }))) as Response["dimensions"];
    } catch {
      dimensions = null;
    }

    const countries = (await page
      .$$("#manufacturerHolder img + span")
      .then((elements) =>
        Promise.all(
          elements.map((el) =>
            el
              .textContent()
              .then((text) => ({ name: this.extractText("country", text) }))
          )
        )
      )) as Response["countries"];

    let ppwMarket;
    try {
      ppwMarket = await page
        .locator("text=Watt or more >> nth=1")
        .textContent()
        .then((text) =>
          parseFloat(this.extractText("ppwMarket", text, /\$(.+)\//))
        );
    } catch {
      ppwMarket = null;
    }

    const rating: Rating = await page
      .locator(".nrel-rating-pretext >> nth=0")
      .textContent()
      .then((text) => {
        const value = this.extractText("rating", text) as keyof typeof Rating;
        return Rating[value];
      });

    const productImage = await page
      .locator(".bluebook-block-holder img >> nth=0")
      .getAttribute("srcset");

    await page.close();

    const panel: Response = {
      wattage,
      model,
      series,
      efficiency,
      rating,
      degradation,
      output25,
      warranty,
      productImage,
      ppwMarket,
      material,
      manufacturer,
      energySageLink,
      countries,
      colors,
      dimensions,
    };

    return panel;
  }

  async closeBrowser() {
    await (await this.context).close();
    await (await this.browser).close();
  }
}

export const energysage = new EnergySageAPI();
