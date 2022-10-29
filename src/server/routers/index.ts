// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { PropertyRouter } from "./property.router";
import { BillRouter } from "./bill.router";
import { QuoteRouter } from "./quote.router";
import { PanelsRouter } from "./panels.router";
import { InstallerRouter } from "./installers.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("property.", PropertyRouter)
  .merge("quote.", QuoteRouter)
  .merge("bill.", BillRouter)
  .merge("panels.", PanelsRouter)
  .merge("installers.", InstallerRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
