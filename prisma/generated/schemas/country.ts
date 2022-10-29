import * as z from "zod"
import { CompleteSolarPanel, RelatedSolarPanelModel } from "./index"

export const CountryModel = z.object({
  id: z.string(),
  name: z.string(),
})

export interface CompleteCountry extends z.infer<typeof CountryModel> {
  solarPanels: CompleteSolarPanel[]
}

/**
 * RelatedCountryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCountryModel: z.ZodSchema<CompleteCountry> = z.lazy(() => CountryModel.extend({
  solarPanels: RelatedSolarPanelModel.array(),
}))
