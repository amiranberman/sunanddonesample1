import { createProtectedRouter } from "./protected-router";
import { app } from "../app";
import { RatesService } from "../services/rates.service";
import { z } from "zod";
import { createRouter } from "./context";

export const publicRouter = createProtectedRouter().query("", {
  input: z.object({
    billId: z.string(),
  }),
  async resolve({ ctx, input }) {
    return (await app).get(RatesService);
  },
});

export const PropertyRouter = createRouter().merge("public.", publicRouter);
