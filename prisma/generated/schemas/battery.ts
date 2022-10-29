import * as z from "zod"
import { CompleteAddons, RelatedAddonsModel } from "./index"

export const BatteryModel = z.object({
  id: z.string(),
  cost: z.number(),
})

export interface CompleteBattery extends z.infer<typeof BatteryModel> {
  addons: CompleteAddons[]
}

/**
 * RelatedBatteryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBatteryModel: z.ZodSchema<CompleteBattery> = z.lazy(() => BatteryModel.extend({
  addons: RelatedAddonsModel.array(),
}))
