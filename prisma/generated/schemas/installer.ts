import * as z from "zod"
import { CompleteInstallerType, RelatedInstallerTypeModel, CompleteState, RelatedStateModel, CompleteInstallerReview, RelatedInstallerReviewModel, CompleteInstallerSolarPanel, RelatedInstallerSolarPanelModel } from "./index"

export const InstallerModel = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  founded: z.date(),
  warranty: z.number().int(),
  subcontract: z.boolean(),
  solarinsure: z.boolean(),
})

export interface CompleteInstaller extends z.infer<typeof InstallerModel> {
  types: CompleteInstallerType[]
  operatingStates: CompleteState[]
  reviews: CompleteInstallerReview[]
  solarPanels: CompleteInstallerSolarPanel[]
}

/**
 * RelatedInstallerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInstallerModel: z.ZodSchema<CompleteInstaller> = z.lazy(() => InstallerModel.extend({
  types: RelatedInstallerTypeModel.array(),
  operatingStates: RelatedStateModel.array(),
  reviews: RelatedInstallerReviewModel.array(),
  solarPanels: RelatedInstallerSolarPanelModel.array(),
}))
