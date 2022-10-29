import {
  AddressComponent,
  AddressType,
} from "@googlemaps/google-maps-services-js";

import {
  GooglePlacesAutocompleteResponse,
  GooglePlacesAutocompleteAddress,
} from "./PlacesAPI.types";

import * as Google from "@googlemaps/google-maps-services-js";

export class PlacesAPI {
  private client: Google.Client;
  private key: string;

  constructor(key: string = process.env.SERVER_MAPS_API_KEY!) {
    this.client = new Google.Client();
    this.key = key;
  }

  async getPlaceDetails(place_id: string): Promise<{
    location: [number, number];
    address: GooglePlacesAutocompleteAddress;
  }> {
    return this.client
      .placeDetails({
        params: {
          key: this.key,
          place_id,
        },
      })
      .then(({ data }) => {
        if (!data.result.geometry) {
          throw new Error("No address geometry data");
        }
        const { lat, lng } = data.result.geometry.location;
        const address = this.getAddressComponents(
          data.result.address_components!
        );
        return {
          location: [lat, lng],
          address,
        };
      });
  }

  async getAutocomplete(
    input: string
  ): Promise<GooglePlacesAutocompleteResponse> {
    const places = await this.client
      .placeAutocomplete({
        params: {
          input,
          key: this.key,
        },
      })
      .then(({ data }) =>
        data.predictions.map(({ place_id, description }) => ({
          place_id,
          description,
        }))
      );

    if (!places.length) {
      throw new Error("Address is invalid");
    }

    // Concurrently retrieve address_components for all places using place_id
    return Promise.all(
      places.map(async ({ place_id, description }) =>
        this.client
          .placeDetails({
            params: {
              place_id,
              key: this.key,
            },
          })
          .then(({ data }) => {
            if (!data.result.geometry) {
              throw new Error("No address geometry data");
            }
            const { lat, lng } = data.result.geometry.location;
            const address = this.getAddressComponents(
              data.result.address_components!
            );
            return {
              place_id,
              description,
              location: [lat, lng],
              address,
            };
          })
      )
    );
  }

  getAddressComponents(
    components: AddressComponent[]
  ): GooglePlacesAutocompleteAddress {
    const validTypes = {
      [AddressType.street_number]: "street_number",
      [AddressType.route]: "street",
      [AddressType.locality]: "city",
      [AddressType.administrative_area_level_1]: "state",
      [AddressType.postal_code]: "zipcode",
    };

    // Match types exactly
    const validTypesReg = new RegExp(
      `^${Object.keys(validTypes).join("$|^")}$`
    );
    return components
      .map((component) => {
        return component.types
          .filter((type) => validTypesReg.test(type))
          .map((type) => {
            //@ts-ignore
            return { [validTypes[type]]: component.long_name };
          })[0]!;
      })
      .reduce((r, c) => Object.assign(r, c), {});
  }
}

export const places = new PlacesAPI();
