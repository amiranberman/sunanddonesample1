import * as z from "zod"
import { CompleteImage, RelatedImageModel, CompleteDimensions, RelatedDimensionsModel, CompleteSolarPanelColors, RelatedSolarPanelColorsModel, CompleteCountry, RelatedCountryModel, CompleteInstallerSolarPanel, RelatedInstallerSolarPanelModel } from "./index"

export const SolarPanelModel = z.object({
  id: z.string(),
  model: z.string(),
  series: z.string().nullish(),
  wattage: z.number().int(),
  efficiency: z.number(),
  rating: z.number().int(),
  degradation: z.number(),
  output25: z.number(),
  warranty: z.number().int(),
  productImage: z.string().nullish(),
  ppwMarket: z.number().nullish(),
  material: z.string(),
  manufacturer: z.string(),
  energySageLink: z.string(),
  dimensionsId: z.string().nullish(),
  solarPanelColorsId: z.string(),
})

export interface CompleteSolarPanel extends z.infer<typeof SolarPanelModel> {
  images: CompleteImage[]
  dimensions?: CompleteDimensions | null
  colors: CompleteSolarPanelColors
  countries: CompleteCountry[]
  installers: CompleteInstallerSolarPanel[]
}

/**
 * RelatedSolarPanelModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSolarPanelModel: z.ZodSchema<CompleteSolarPanel> = z.lazy(() => SolarPanelModel.extend({
  images: RelatedImageModel.array(),
  dimensions: RelatedDimensionsModel.nullish(),
  colors: RelatedSolarPanelColorsModel,
  countries: RelatedCountryModel.array(),
  installers: RelatedInstallerSolarPanelModel.array(),
}))
