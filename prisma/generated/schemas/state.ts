import * as z from "zod"
import { CompleteInstaller, RelatedInstallerModel } from "./index"

export const StateModel = z.object({
  name: z.string(),
  abbreviation: z.string(),
  sunnumber: z.number().int(),
})

export interface CompleteState extends z.infer<typeof StateModel> {
  installer: CompleteInstaller[]
}

/**
 * RelatedStateModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedStateModel: z.ZodSchema<CompleteState> = z.lazy(() => StateModel.extend({
  installer: RelatedInstallerModel.array(),
}))
