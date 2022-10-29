import * as z from "zod"
import { CompleteSolarPanel, RelatedSolarPanelModel } from "./index"

export const DimensionsModel = z.object({
  id: z.string(),
  length: z.number(),
  width: z.number(),
  depth: z.number(),
})

export interface CompleteDimensions extends z.infer<typeof DimensionsModel> {
  panel: CompleteSolarPanel[]
}

/**
 * RelatedDimensionsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDimensionsModel: z.ZodSchema<CompleteDimensions> = z.lazy(() => DimensionsModel.extend({
  panel: RelatedSolarPanelModel.array(),
}))
