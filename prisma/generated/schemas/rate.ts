import * as z from "zod"
import { CompleteAddress, RelatedAddressModel } from "./index"

export const RateModel = z.object({
  id: z.string(),
  utility: z.string(),
  commercial: z.number(),
  residential: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteRate extends z.infer<typeof RateModel> {
  address: CompleteAddress[]
}

/**
 * RelatedRateModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRateModel: z.ZodSchema<CompleteRate> = z.lazy(() => RateModel.extend({
  address: RelatedAddressModel.array(),
}))
