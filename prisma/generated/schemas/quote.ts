import * as z from "zod"
import { QuoteType } from "@prisma/client"
import { CompleteAddress, RelatedAddressModel, CompleteBill, RelatedBillModel, CompleteInstallerSolarPanel, RelatedInstallerSolarPanelModel, CompleteAddons, RelatedAddonsModel } from "./index"

export const QuoteModel = z.object({
  id: z.string(),
  type: z.nativeEnum(QuoteType),
  offsetTarget: z.number(),
  installerSolarPanelId: z.string(),
  billId: z.string(),
  installerSolarPanelInstallerId: z.string(),
  installerSolarPanelSolarPanelId: z.string(),
  addressId: z.string(),
})

export interface CompleteQuote extends z.infer<typeof QuoteModel> {
  address: CompleteAddress
  bill: CompleteBill
  product: CompleteInstallerSolarPanel
  addons?: CompleteAddons | null
}

/**
 * RelatedQuoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQuoteModel: z.ZodSchema<CompleteQuote> = z.lazy(() => QuoteModel.extend({
  address: RelatedAddressModel,
  bill: RelatedBillModel,
  product: RelatedInstallerSolarPanelModel,
  addons: RelatedAddonsModel.nullish(),
}))
