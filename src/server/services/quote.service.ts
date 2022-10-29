import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { filterSchema } from "@/schemas/filter";
import { z } from "zod";

type QuoteWithAllRelations = Prisma.QuoteGetPayload<{
  include: {
    bill: true;
    address: {
      include: {
        rate: true;
      };
    };
    product: {
      include: {
        installer: true;
        panel: {
          include: {
            countries: true;
            colors: true;
            images: true;
          };
        };
      };
    };
  };
}>;

type CalculateQuote = Omit<
  QuoteWithAllRelations,
  | "id"
  | "installerId"
  | "installerSolarPanelId"
  | "billId"
  | "installerSolarPanelSolarPanelId"
  | "installerSolarPanelInstallerId"
  | "addressId"
>;

@Injectable()
export class QuoteService {
  private readonly FEE = 1500;
  private readonly TAX_CREDIT = 0.3;
  private readonly EFFICIENCY = 0.000863;

  constructor(private readonly prismaService: PrismaService) {}

  async create(input: Prisma.QuoteCreateInput) {
    const quote: QuoteWithAllRelations = await this.prismaService.quote.create({
      data: {
        ...input,
      },
      include: {
        bill: true,
        address: {
          include: {
            rate: true,
          },
        },
        product: {
          include: {
            installer: true,
            panel: {
              include: {
                countries: true,
                colors: true,
                images: true,
              },
            },
          },
        },
        addons: true,
      },
    });

    return this.calculateQuote(quote);
  }

  async find(input: Prisma.QuoteFindManyArgs) {
    this.prismaService.quote.findMany({
      include: {
        address: true,
        bill: true,
        product: true,
        addons: true,
      },
      where: {},
    });
  }
  async calculateQuote(
    quote: CalculateQuote,
    filters?: z.infer<typeof filterSchema>
  ) {
    const efficiency = +(quote.address.sunnumber * this.EFFICIENCY).toFixed(2);
    const monthlyBill = +(
      quote.bill.monthlyUsage * quote.address.rate.residential.toNumber()
    ).toFixed(2); //should it be toNumber?
    const monthlyUsage = quote.bill.monthlyUsage;
    const annualUsage = monthlyUsage * 12;
    const baseSize = +(annualUsage / efficiency).toFixed(2);
    const size = +(
      quote.offsetTarget.toNumber() * parseFloat((baseSize / 1000).toFixed(1))
    ).toFixed(2);
    const production = +(size * efficiency * 1000).toFixed(2);
    const panelCount = Math.ceil((size * 1000) / quote.product.panel.wattage);
    if (filters?.panelCount?.length) {
      const inRange = filters.panelCount.filter((range) => {
        const min = range[0]!;
        const max = range[1];
        return min < panelCount && max ? panelCount < max : true;
      }).length;
      if (!inRange) return;
    }
    const inverterCount = panelCount;
    //TODO: fix addon cost = 0
    const upfrontCost = +(
      this.FEE +
      142 * size +
      0 +
      size * quote.product.cost.toNumber() * 1000
    ).toFixed(0);
    const netCost = +(upfrontCost * (1 - this.TAX_CREDIT)).toFixed(0);
    const taxCredit = +(upfrontCost * this.TAX_CREDIT).toFixed(0);
    const newMonthlyBill = +(
      ((annualUsage - 0.95 * production) *
        quote.address.rate.residential.toNumber()) /
      12
    ).toFixed(0);
    //TODO: fix loan cost = 0
    const monthlySavings = Math.ceil(monthlyBill - newMonthlyBill - 0)
    const annualSavings = +(monthlySavings * 12).toFixed(2);
    const lifetimeSavings = +(annualSavings * 25).toFixed(2);
    const yearlySavings = +this._yearlySavings(
      annualSavings,
      0.04,
      quote.product.panel.degradation.toNumber(),
      25
    ).toFixed(2);
    //(NetCost/AnnualSavings) / ((1+inflationrate)^(NetCost/AnnualSavings)
    const paybackPeriod = +(
      netCost /
      annualSavings /
      Math.pow(1 + 0.04, netCost / annualSavings)
    ).toFixed(2);

    const actualSize = +(
      (panelCount * quote.product.panel.wattage) /
      1000
    ).toFixed(2);

    const productionActual = +(actualSize * efficiency * 1000).toFixed(2);

    const actualOffset = +(productionActual / annualUsage).toFixed(2);

    const addedHomeValue = (size * 4000).toFixed(0);

    const savings = {
      year: {
        1: +this._yearlySavings(
          annualSavings,
          0.04,
          quote.product.panel.degradation.toNumber(),
          1
        ).toFixed(0),
        5: +this._yearlySavings(
          annualSavings,
          0.04,
          quote.product.panel.degradation.toNumber(),
          5
        ).toFixed(0),
        10: +this._yearlySavings(
          annualSavings,
          0.04,
          quote.product.panel.degradation.toNumber(),
          10
        ).toFixed(0),
        15: +this._yearlySavings(
          annualSavings,
          0.04,
          quote.product.panel.degradation.toNumber(),
          15
        ).toFixed(0),
        25: +this._yearlySavings(
          annualSavings,
          0.04,
          quote.product.panel.degradation.toNumber(),
          25
        ).toFixed(0),
      },
    };

    return {
      id: quote.product.id,
      quote,
      panel: {
        ...quote.product.panel,
        name: `${quote.product.panel.manufacturer} ${quote.product.panel.model}`,
      },
      installer: {
        ...quote.product.installer,
      },
      savings,
      panelCount,
      inverterCount,
      efficiency,
      monthlyBill,
      monthlyUsage,
      annualUsage,
      baseSize,
      size,
      production,
      upfrontCost,
      netCost,
      taxCredit,
      newMonthlyBill,
      monthlySavings,
      annualSavings,
      yearlySavings,
      lifetimeSavings,
      paybackPeriod,
      actualOffset,
      actualSize,
      addedHomeValue,
    };
  }

  private _yearlySavings(
    annualSavings: number,
    averageInflation: number,
    degradation: number,
    years: number
  ) {
    return (
      annualSavings *
      years *
      Math.pow(1 + averageInflation, (years / 2)) *
      Math.pow(1 - degradation / 100, (years / 2))
    );
  }
}
