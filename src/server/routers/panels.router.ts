import { SolarPanelModel } from "@/prisma/solarpanel";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";
import { energysage, Response } from "@sunanddone/energysage-api";

const publicRoutes = createRouter().query("get", {
  async resolve({ ctx }) {
    return ctx.prisma.solarPanel.findMany({
      include: {
        images: true,
        colors: true,
        countries: true,
      },
    });
  },
});

//TODO: change this to a protected route
const privateRoutes = createRouter()
  .query("getFromEnergysage", {
    input: z.object({
      url: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const test = await energysage.getPanel("url", input.url);
        return test;
      } catch (error) {}
    },
  })
  .mutation("create", {
    input: SolarPanelModel,
    async resolve({ ctx, input }) {
      try {
        ctx.prisma.solarPanel.create({
          data: input,
        });
      } catch (error) {
        TRPCError("Error creating panel");
      }
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        ctx.prisma.solarPanel.delete({
          where: {
            id: input.id,
          },
        });
      } catch {}
    },
  });

export const PanelsRouter = createRouter()
  .merge("private.", privateRoutes)
  .merge("public.", publicRoutes);
