import { type Person, type PointEntry } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const PointEditSchema = z
  .object({
    personId: z.number().int(),
    points: z.number().int().min(1),
    numVoters: z.number().int().min(1).optional(),
    date: z.date().default(new Date()),
    wasDouble: z.boolean(),
    wasTriple: z.boolean(),
  })
  .refine((schema) => !(schema.wasDouble && schema.wasTriple), {
    message: "Cannot be wasDouble and wasTriple",
    path: ["wasDouble", "wasTriple"],
  })
  .refine(
    ({ wasDouble, wasTriple, points, numVoters }) => {
      if (!numVoters) return true;
      if (wasDouble) return points === numVoters * 2;
      if (wasTriple) return points === numVoters * 3;
      return points < numVoters;
    },
    ({ points, numVoters, wasDouble, wasTriple }) => ({
      message: `Invalid points total '${points}' for number of voters '${numVoters}'`,
      params: { points, numVoters, wasDouble, wasTriple },
    }),
  );

const PointCreateSchema = z.intersection(
  PointEditSchema,
  z.object({
    numVoters: z.number().int().min(1),
  }),
);

export const pointRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          filterPerson: z.string().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }): Promise<PointEntryWithPerson[]> => {
      return await ctx.db.pointEntry.findMany({
        where: {
          date: {
            gte: input?.startDate,
            lte: input?.endDate,
          },
          Person: {
            name: input?.filterPerson,
          },
        },
        include: { Person: true },
        orderBy: { date: "desc" },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        point: PointEditSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.update({
        data: input.point,
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(PointCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.create({
        data: input,
      });
    }),

  deleteById: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.delete({ where: { id: input } });
    }),
});

export type PointEntryWithPerson = PointEntry & { Person: Person };
