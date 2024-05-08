import { type Person, type PointEntry } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const PointCreateEditSchema = z
  .object({
    personId: z.number().int(),
    points: z.number().int().min(1),
    date: z.date().default(new Date()),
    wasDouble: z.boolean(),
    wasTriple: z.boolean(),
  })
  .refine((schema) => !(schema.wasDouble && schema.wasTriple), {
    message: "Cannot be wasDouble and wasTriple",
    path: ["wasDouble", "wasTriple"],
  });

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
        point: PointCreateEditSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.update({
        data: {
          date: input.point.date,
          points: input.point.points,
          Person: {
            connect: {
              id: input.point.personId,
            },
          },
          wasDouble: input.point.wasDouble,
          wasTriple: input.point.wasTriple,
        },
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(PointCreateEditSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.create({
        data: {
          date: input.date,
          points: input.points,
          Person: {
            connect: {
              id: input.personId,
            },
          },
          wasDouble: input.wasDouble,
          wasTriple: input.wasTriple,
        },
      });
    }),

  deleteById: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.delete({ where: { id: input } });
    }),
});

export type PointEntryWithPerson = PointEntry & { Person: Person };
