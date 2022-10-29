import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteAddress, RelatedAddressModel } from "./index"

export const PropertyModel = z.object({
  id: z.string(),
  userId: z.string(),
  addressId: z.string(),
})

export interface CompleteProperty extends z.infer<typeof PropertyModel> {
  user: CompleteUser
  address: CompleteAddress
}

/**
 * RelatedPropertyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPropertyModel: z.ZodSchema<CompleteProperty> = z.lazy(() => PropertyModel.extend({
  user: RelatedUserModel,
  address: RelatedAddressModel,
}))
