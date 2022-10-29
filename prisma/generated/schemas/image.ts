import * as z from "zod"
import { CompleteSolarPanel, RelatedSolarPanelModel } from "./index"

export const ImageModel = z.object({
  id: z.string(),
  url: z.string(),
})

export interface CompleteImage extends z.infer<typeof ImageModel> {
  SolarPanel: CompleteSolarPanel[]
}

/**
 * RelatedImageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedImageModel: z.ZodSchema<CompleteImage> = z.lazy(() => ImageModel.extend({
  SolarPanel: RelatedSolarPanelModel.array(),
}))
