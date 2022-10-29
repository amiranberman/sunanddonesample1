import { InstallerModel } from "@/prisma/installer";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

const publicRoutes = createRouter().query("get", {
  async resolve({ ctx }) {
    return ctx.prisma.installer.findMany({});
  },
});

//TODO: change this to a protected route
const privateRoutes = createRouter().mutation("create", {
  input: InstallerModel,
  async resolve({ ctx, input }) {
    try {
      ctx.prisma.installer.create({
        data: input,
      });
    } catch (error) {}
  },
});

export const InstallerRouter = createRouter()
  .merge("private.", privateRoutes)
  .merge("public.", publicRoutes);
