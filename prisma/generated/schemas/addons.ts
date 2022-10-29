import * as z from "zod"
import { CompleteQuote, RelatedQuoteModel, CompleteInverter, RelatedInverterModel, CompleteBattery, RelatedBatteryModel } from "./index"

export const AddonsModel = z.object({
  quoteId: z.string(),
  inverterId: z.string().nullish(),
  batteryId: z.string().nullish(),
})

export interface CompleteAddons extends z.infer<typeof AddonsModel> {
  quote: CompleteQuote
  inverter?: CompleteInverter | null
  battery?: CompleteBattery | null
}

/**
 * RelatedAddonsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddonsModel: z.ZodSchema<CompleteAddons> = z.lazy(() => AddonsModel.extend({
  quote: RelatedQuoteModel,
  inverter: RelatedInverterModel.nullish(),
  battery: RelatedBatteryModel.nullish(),
}))
