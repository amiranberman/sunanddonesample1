import { createProtectedRouter } from "./protected-router";
import { app } from "../app";
import { QuoteService } from "../services/quote.service";
import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Decimal } from "@prisma/client/runtime";
import { validationSchema } from "@/schemas/usage";
import { Prisma, PropertyType } from "@prisma/client";
import { filterSchema } from "@/schemas/filter";

export const publicRouter = createRouter()
  .mutation("create", {
    input: z.object({
      bill: z.string(),
      address: z.string(),
    }),
    async resolve({ ctx, input }) {
      // return ctx.prisma.quote.createMany({
      //   data: {
      //     addressId: input.address,
      //     billId: input.bill,
      //     s
      //   }
      // })
      const quotes = [];
      const address = await ctx.prisma.address.findUnique({
        where: { id: input.address },
        include: {
          rate: true,
        },
      });
      if (!address) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Address not found",
        });
      }
      const products = await ctx.prisma.installerSolarPanel.findMany({
        orderBy: {
          featured: "desc",
        },
        where: {
          installer: {
            operatingStates: {
              some: {
                name: address.state,
              },
            },
          },
        },
        include: {
          installer: true,
          panel: {
            include: {
              colors: true,
              countries: true,
              dimensions: false,
              images: true,
            },
          },
        },
      });
      const bill = await ctx.prisma.bill.findUnique({
        where: { id: input.bill },
      });
      if (!bill) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bill not found",
        });
      }
      for (let product of products) {
        const quote = await (await app).get(QuoteService).calculateQuote({
          offsetTarget: new Decimal(1.2),
          type: "CASH",
          bill,
          address,
          product,
        });
        if (quote) quotes.push(quote);
      }
      return quotes;
      // return (await app).get(QuoteService).create({
      //     address: {
      //       connect: {
      //         id: input.address
      //       }
      //     },
      //     bill: {
      //       connect: {
      //         id: input.bill
      //       }
      //     }
      // });
    },
  })
  .query("infiniteQuotes", {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      bill: z.object({
        propertyType: z.nativeEnum(PropertyType),
        monthlyUsage: z.number().min(0),
      }),
      address: z.string(),
      filters: filterSchema,
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const quotes = [];

      const address = await ctx.prisma.address.findUnique({
        where: { id: input.address },
        include: {
          rate: true,
        },
      });
      if (!address) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Address not found",
        });
      }

      const where: Prisma.InstallerSolarPanelWhereInput = {
        available: true,
        installer: {
          operatingStates: {
            some: {
              name: address.state,
            },
          },
        },
      };
      const products = await ctx.prisma.installerSolarPanel.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        where,
        orderBy: [
          {
            cost: "asc",
          },
          {
            featured: "desc",
          },
        ],
        include: {
          installer: true,
          panel: {
            include: {
              colors: true,
              countries: true,
              dimensions: false,
              images: true,
            },
          },
        },
      });
      for (let product of products) {
        const quote = await (await app).get(QuoteService).calculateQuote(
          {
            offsetTarget: new Decimal(input.filters?.desiredOffset ?? 1),
            type: "CASH",
            bill: {
              id: "",
              ...input.bill,
            },
            address,
            product,
          },
          input.filters
        );
        if (quote) quotes.push(quote);
      }
      let nextCursor: typeof cursor | undefined = undefined;
      if (products.length) {
        nextCursor = products[products.length - 1]!.id;
      }
      return {
        quotes,
        nextCursor,
      };
    },
  });

export const QuoteRouter = createRouter().merge("public.", publicRouter);
