import { z } from "zod";
import { places } from "@sunanddone/places-api";
import { xome } from "@sunanddone/xome-api";
import { sunroof } from "@sunanddone/sunroof-api";
import { TRPCError } from "@trpc/server";
import { differenceInDays } from "date-fns";
// import { createProtectedRouter } from "./protected-router";
import { PropertyFactsResponse } from "@sunanddone/xome-api/dist/XomeAPI.types";
import { SunroofResponse } from "@sunanddone/sunroof-api/dist/SunroofAPI";
import { createRouter } from "./context";
import { app } from "../app";
import { PropertyService } from "../services/property.service";
import { AddressService } from "../services/address.service";
import { openei } from "@sunanddone/openei-api";

const publicRoutes = createRouter()
  .mutation("createWithAddress", {
    input: z.object({
      placeId: z.string(),
    }),
    async resolve({ ctx, input: { placeId } }) {
      try {
        const res = await ctx.prisma.address.findUniqueOrThrow({
          where: { placeId },
          include: { location: true, rate: true },
        });
        if (differenceInDays(Date.now(), res.updatedAt) >= 100)
          throw Error(
            "Address is more than 100 days out of date. Refreshing..."
          );
        return res;
      } catch (error) {
        // console.error(error);
      }
      const {
        location,
        address: { city, zipcode, state, street_number, street: street_street },
      } = await places.getPlaceDetails(placeId);
      if (!city || !zipcode || !state || !street_street || !street_number) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not a valid address",
        });
      }
      let sunnumber: number;
      let roofspace: number | undefined = undefined;
      try {
        const sunroofData = await sunroof.getDataByLatLng(...location);
        sunnumber = sunroofData?.sunnumber!;
        roofspace = sunroofData?.roofspace!;
      } catch {
        const stateRes = await ctx.prisma.state.findUnique({
          where: { name: state },
        });
        if (!stateRes) {
          throw new Error("Default sunnumber not found");
        }
        sunnumber = stateRes.sunnumber;
      }

      const street = `${street_number} ${street_street}`;
      let value = await xome
        .getPropertyValue(street, city, zipcode)
        .catch((error) => {
          console.log(error);
        });
      const facts = await xome
        .getPropertyFacts(street, zipcode)
        .catch((error) => {
          console.log(error);
          // throw error;
        });

      const { squareFeet, bedrooms, lotSize, owner } = {
        ...(facts as any),
      } as PropertyFactsResponse;

      let rate: any;
      try {
        rate = await openei.get(...location);
      } catch {
        const zip = await ctx.prisma.zipcode.findUnique({
          where: { id: zipcode },
        });
        if (!zip) {
          throw new Error("No rate found for this address");
        }
        rate = {
          id: zip.id,
          residential: zip.residential,
          commercial: zip.commercial,
          utility: zip.utility,
        };
      }

      return ctx.prisma.address
        .create({
          data: {
            placeId,
            street,
            city,
            state,
            zipcode,
            sunnumber,
            roofspace,
            value: value ?? null,
            squareFeet,
            lotSize,
            bedrooms,
            owner,
            rate: {
              create: rate,
            },
            location: {
              connectOrCreate: {
                where: {
                  lat_lon: {
                    lat: location[0],
                    lon: location[1],
                  },
                },
                create: {
                  lat: location[0],
                  lon: location[1],
                },
              },
            },
          },
          include: {
            location: true,
            rate: true,
          },
        })
        .catch((error) => {
          console.log(error);
          return ctx.prisma.address.findFirstOrThrow({
            where: {
              placeId,
            },
            include: {
              rate: true,
              location: true,
            },
          });
        });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      return ctx.prisma.address.findUnique({
        where: { id },
        include: {
          rate: true,
          location: true,
        },
      });
    },
  });

export const PropertyRouter = createRouter().merge("public.", publicRoutes);
// .query("search", {
//   input: z.object({
//     query: z.string(),
//   }),
//   async resolve({ ctx, input: { query } }) {
//     return ctx.prisma.address.findFirst({ where: { street } });
//   },
// });
