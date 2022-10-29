import { createProtectedRouter } from "./protected-router";
import { createRouter } from "./context";
import { validationSchema } from "@/schemas/usage";
import { TRPCError } from "@trpc/server";

export const publicRoutes = createRouter().mutation("create", {
  input: validationSchema,
  async resolve({ ctx, input: { monthlyUsage, propertyType } }) {
    if (!monthlyUsage || !propertyType) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Monthly usage is required",
      });
    }
    return ctx.prisma.bill.create({
      data: {
        monthlyUsage,
        propertyType,
      },
    });
  },
});

export const BillRouter = createRouter().merge("public.", publicRoutes);
