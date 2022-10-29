export interface PropertyFactsResponse {
  bedrooms: number;
  bathsFull: number;
  bathsHalf: number;
  squareFeet: number;
  stories: number;
  propertyType: string;
  county: string;
  lotSize: number;
  yearBuilt: number;
  pool: boolean;
  fireplace: boolean;
  construction: string;
  owner: string;
  parcelNumber: string;
  subjectZoning: string;
  latitude: number;
  longitude: number;
  bathsTotal: number;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  evaluatedOn: string | null;
}

export interface APIKeyResponse {
  key: string;
}
