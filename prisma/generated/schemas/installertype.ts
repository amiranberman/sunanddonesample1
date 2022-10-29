import * as z from "zod"
import { InstallerTypeEnum } from "@prisma/client"
import { CompleteInstaller, RelatedInstallerModel } from "./index"

export const InstallerTypeModel = z.object({
  id: z.string(),
  type: z.nativeEnum(InstallerTypeEnum),
})

export interface CompleteInstallerType extends z.infer<typeof InstallerTypeModel> {
  installer: CompleteInstaller[]
}

/**
 * RelatedInstallerTypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInstallerTypeModel: z.ZodSchema<CompleteInstallerType> = z.lazy(() => InstallerTypeModel.extend({
  installer: RelatedInstallerModel.array(),
}))
