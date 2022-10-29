import * as z from "zod"
import { CompleteSolarPanel, RelatedSolarPanelModel } from "./index"

export const SolarPanelColorsModel = z.object({
  id: z.string(),
  cell: z.string(),
  frame: z.string(),
  backsheet: z.string(),
})

export interface CompleteSolarPanelColors extends z.infer<typeof SolarPanelColorsModel> {
  SolarPanel: CompleteSolarPanel[]
}

/**
 * RelatedSolarPanelColorsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSolarPanelColorsModel: z.ZodSchema<CompleteSolarPanelColors> = z.lazy(() => SolarPanelColorsModel.extend({
  SolarPanel: RelatedSolarPanelModel.array(),
}))
