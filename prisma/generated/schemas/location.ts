import * as z from "zod"
import { CompleteAddress, RelatedAddressModel } from "./index"

export const LocationModel = z.object({
  id: z.string(),
  lat: z.number(),
  lon: z.number(),
})

export interface CompleteLocation extends z.infer<typeof LocationModel> {
  address: CompleteAddress[]
}

/**
 * RelatedLocationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLocationModel: z.ZodSchema<CompleteLocation> = z.lazy(() => LocationModel.extend({
  address: RelatedAddressModel.array(),
}))
