import * as z from "zod"
import { CompleteAddons, RelatedAddonsModel } from "./index"

export const InverterModel = z.object({
  id: z.string(),
  cost: z.number(),
})

export interface CompleteInverter extends z.infer<typeof InverterModel> {
  addons: CompleteAddons[]
}

/**
 * RelatedInverterModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInverterModel: z.ZodSchema<CompleteInverter> = z.lazy(() => InverterModel.extend({
  addons: RelatedAddonsModel.array(),
}))
