import { z } from "zod";

export const filterSchema = z
  .object({
    desiredOffset: z.number().optional(),
    panelCount: z.array(z.array(z.number())).optional(),
    installerRating: z.array(z.array(z.number())).optional(),
  })
  .optional();
