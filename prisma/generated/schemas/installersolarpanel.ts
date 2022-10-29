import * as z from "zod"
import { CompleteInstaller, RelatedInstallerModel, CompleteSolarPanel, RelatedSolarPanelModel, CompleteQuote, RelatedQuoteModel } from "./index"

export const InstallerSolarPanelModel = z.object({
  id: z.string(),
  installerId: z.string(),
  solarPanelId: z.string(),
  cost: z.number(),
  available: z.boolean(),
  featured: z.boolean(),
})

export interface CompleteInstallerSolarPanel extends z.infer<typeof InstallerSolarPanelModel> {
  installer: CompleteInstaller
  panel: CompleteSolarPanel
  quotes: CompleteQuote[]
}

/**
 * RelatedInstallerSolarPanelModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInstallerSolarPanelModel: z.ZodSchema<CompleteInstallerSolarPanel> = z.lazy(() => InstallerSolarPanelModel.extend({
  installer: RelatedInstallerModel,
  panel: RelatedSolarPanelModel,
  quotes: RelatedQuoteModel.array(),
}))
