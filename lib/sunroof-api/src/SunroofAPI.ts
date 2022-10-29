import axios from "axios";

export interface SunroofResponse {
  sunnumber: number;
  roofspace: number;
}

export class SunroofAPI {
  formatText(input: string) {
    return input.trim().split(" ")[0]!.replace(/[,]+/g, "");
  }

  async getDataByLatLng(lat: number, lng: number): Promise<SunroofResponse> {
    const html = await axios(
      `https://sunroof.withgoogle.com/building/${lat}/${lng}`
    )
      .then((res) => res.data)
      .catch((error) => {
        error.message = "Sunnumber not found";
        throw error;
      });
    const buildingResponseJspb = JSON.parse(
      eval(html.match(/buildingResponseJspb = ('.*');/)![1])
    );
    // This looks like magic, but I promise this is how Google is doing it.
    const roofspace = Math.round(buildingResponseJspb[1][7][1] * 10.7639);
    const sunnumber = Math.round(buildingResponseJspb[1][7][2]);
    return { sunnumber, roofspace };
  }
}

export const sunroof = new SunroofAPI();
