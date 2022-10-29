import * as z from "zod"
import { CompleteInstaller, RelatedInstallerModel } from "./index"

export const InstallerReviewModel = z.object({
  id: z.string(),
  rating: z.number().int(),
})

export interface CompleteInstallerReview extends z.infer<typeof InstallerReviewModel> {
  installer: CompleteInstaller[]
}

/**
 * RelatedInstallerReviewModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInstallerReviewModel: z.ZodSchema<CompleteInstallerReview> = z.lazy(() => InstallerReviewModel.extend({
  installer: RelatedInstallerModel.array(),
}))
