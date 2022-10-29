import * as z from "zod"

export const ZipcodeModel = z.object({
  id: z.string(),
  utility: z.string(),
  residential: z.number(),
  commercial: z.number(),
  residential2019: z.number(),
  commercial2019: z.number(),
  netMetering: z.number(),
  solarLCOE: z.number(),
})
