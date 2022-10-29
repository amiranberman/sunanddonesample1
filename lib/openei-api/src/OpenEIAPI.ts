import { Prisma, Rate } from "@prisma/client";
import axios from "axios";

export interface Response extends Prisma.RateCreateWithoutAddressInput {}

export interface OpenEIResponse {
  label: string;
  uri: string;
  revisions: number[];
  approved: boolean;
  is_default: boolean;
  utility: string;
  eiaid: number;
  name: string;
  startdate: number;
  supersedes: string;
  sector: string;
  servicetype: string;
  description: string;
  source: string;
  sourceparent: string;
  demandunits: string;
  flatdemandunit: string;
  demandrateunit: string;
  energyratestructure: Energyratestructure[][];
  energyweekdayschedule: number[][];
  energyweekendschedule: number[][];
  energycomments: string;
  dgrules: string;
  fixedchargeunits: string;
  mincharge: number;
  minchargeunits: string;
  country: string;
}

export interface Energyratestructure {
  max?: number;
  unit: string;
  rate: number;
}

export class OpenEIAPI {
  constructor() {}

  async get(lat: number, lon: number): Promise<Response> {
    const options = {
      method: "GET",
      url: "https://api.openei.org/utility_rates",
      params: {
        version: "7",
        format: "json",
        api_key: "4ERcVsMyymCw3l0MhL4P9mjrXQqkbZLFIKsqkmom",
        sector: "Residential",
        detail: "full",
        approved: "true",
        orderby: "startdate",
        direction: "desc",
        effective_on_date: Date.now().toString(),
        limit: "1",
        is_default: "true",
        lat,
        lon,
      },
    };

    const data: { items: OpenEIResponse[] } = await axios
      .request(options)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    if (!data.items.length) {
      throw new Error("No utility data found");
    }
    const { utility, energyratestructure } = data.items[0]!;
    const rates = energyratestructure[0]!;
    const rate =
      rates.reduce((prev, curr) => prev + curr.rate, 0) / rates.length;
    return {
      utility,
      commercial: rate,
      residential: rate,
    };
  }
}

export const openei = new OpenEIAPI();
