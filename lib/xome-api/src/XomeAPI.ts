import axios, { AxiosError, AxiosRequestConfig } from "axios";
import cheerio from "cheerio";
import { APIKeyResponse, PropertyFactsResponse } from "./XomeAPI.types";

export class XomeAPI {
  accessToken: Promise<string>;
  key: Promise<string>;

  constructor() {
    this.accessToken = this.getAccessToken();
    this.key = this.getAPIKey();
  }

  async getPropertyValue(
    streetAddress: string,
    city: string,
    zip: string
  ): Promise<number> {
    const spaces = /\s/g;
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `https://www.xome.com/realestate/${streetAddress.replace(
        spaces,
        "-"
      )}-${city.replace(spaces, "-")}-${zip}`,
    };
    const html = await axios.request(options).then((response) => response.data);
    const $ = cheerio.load(html);
    const $value = $(".xome-value-estimate");
    if (!$value || $value.text().trim() === "")
      throw new Error("Value not found");
    const value = parseInt($value.text().trim().replace(/[$,]+/g, ""));
    if (isNaN(value)) throw new Error("Value not found");
    return value;
  }

  async getPropertyFacts(
    streetAddress: string,
    zip: string
  ): Promise<PropertyFactsResponse> {
    const options = {
      method: "POST",
      url: "https://api-gw-prod-cus.xome.com/xda-data/api/widgets/property-facts",
      params: { authorization: await this.key, evaluation: "true" },
      headers: { "Content-Type": "application/json" },
      data: { streetAddress, zip },
    };

    let response: PropertyFactsResponse;

    try {
      response = await axios
        .request<PropertyFactsResponse>(options)
        .then(function (response) {
          return response.data;
        });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        switch (error.code) {
          case AxiosError.ERR_BAD_REQUEST:
            throw new Error("Invalid address");
          default:
            throw new Error(error.code);
        }
      }
    }
    return response!;
  }

  async getAccessToken(): Promise<string> {
    const options = {
      method: "GET",
      url: "https://www.xome.com/include/ajax/api.aspx",
      params: { op: "getAnonymousAccessToken" },
    };

    return axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
        throw error;
      });
  }

  async getAPIKey(): Promise<string> {
    const options = {
      method: "GET",
      url: "https://xapi.xome.com/v1/apikey/1",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        Authorization: `Bearer ${await this.accessToken}`,
      },
    };

    return axios
      .request<APIKeyResponse>(options)
      .then(function (response) {
        return response.data.key;
      })
      .catch(function (error) {
        console.error(error);
        throw error;
      });
  }
}

export const xome = new XomeAPI();
