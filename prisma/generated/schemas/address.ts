import * as z from "zod"
import { CompleteLocation, RelatedLocationModel, CompleteProperty, RelatedPropertyModel, CompleteRate, RelatedRateModel, CompleteQuote, RelatedQuoteModel } from "./index"

export const AddressModel = z.object({
  id: z.string(),
  placeId: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  owner: z.string().nullish(),
  sunnumber: z.number().int(),
  roofspace: z.number().int().nullish(),
  squareFeet: z.number().int().nullish(),
  lotSize: z.number().int().nullish(),
  bedrooms: z.number().int().nullish(),
  value: z.number().int().nullish(),
  zipcode: z.string(),
  locationId: z.string(),
  rateId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  location: CompleteLocation
  properties: CompleteProperty[]
  rate: CompleteRate
  quotes: CompleteQuote[]
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  location: RelatedLocationModel,
  properties: RelatedPropertyModel.array(),
  rate: RelatedRateModel,
  quotes: RelatedQuoteModel.array(),
}))
