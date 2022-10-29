import { PropertyType } from "@prisma/client";
import { z } from "zod";

export const propertyTypeSchema = z.object({
  propertyType: z.enum(["home", "apartment", "business"]),
});

export const calculationTypeSchema = z.object({
  calculationType: z.enum(["bill", "estimation"]),
});

export const validationSchema = z
  .object({
    propertyType: z.nativeEnum(PropertyType),
    calculationType: z.enum(["bill", "estimation"]),
    period: z.enum(["annual", "monthly"]).optional(),
    estimation: z.number().min(0).optional(),
    monthlyUsage: z.number().min(0).optional(),
    month: z.number().min(1).max(12).optional(),
    annualUsage: z.number().min(0).optional(),
  })
  .partial()
  .superRefine((data, ctx) => {
    switch (data.period) {
      case "annual":
        if (!data.annualUsage) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["annual"],
            message: "Annual usage is required",
          });
        }
        break;
      case "monthly":
        if (!data.monthlyUsage) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["monthlyUsage"],
            message: "Monthly usage is required",
          });
        }
        break;
      default:
        break;
    }
  });
//.merge(propertyTypeSchema)
//.merge(calculationTypeSchema);
// .partial()
// .superRefine((data, ctx) => {
//   if (data.calculationType === "estimation") {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["estimation"],
//       message: "Estimation should be set",
//     });
//   }
//   if (data.period === "monthly") {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["monthly"],
//       message: "",
//     });
//   }
// });
