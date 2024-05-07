import { type Person, type PointEntry } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
        personId: z.number().int(),
        points: z.number().int(),
        date: z.date().default(new Date()),
        wasDouble: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.pointEntry.update({
        data: {
          date: input.date,
          points: input.points,
          Person: {
            connect: {
              id: input.personId,
            },
          },
          wasDouble: input.wasDouble,
        },
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        personId: z.number().int(),
        points: z.number().int(),
        date: z.date().default(new Date()),
        wasDouble: z.boolean(),
      }),
    )
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
