import * as z from "zod"
import { PropertyType } from "@prisma/client"
import { CompleteQuote, RelatedQuoteModel } from "./index"

export const BillModel = z.object({
  id: z.string(),
  monthlyUsage: z.number().int(),
  propertyType: z.nativeEnum(PropertyType),
})

export interface CompleteBill extends z.infer<typeof BillModel> {
  quotes: CompleteQuote[]
}

/**
 * RelatedBillModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBillModel: z.ZodSchema<CompleteBill> = z.lazy(() => BillModel.extend({
  quotes: RelatedQuoteModel.array(),
}))
