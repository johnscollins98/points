import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const personRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.person.findMany();
  }),

  getAllWithPointTotal: publicProcedure
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const people = await ctx.db.person.findMany({
        include: {
          PointEntry: {
            where: {
              date: {
                gte: input?.startDate,
                lte: input?.endDate,
              },
            },
            select: { points: true },
          },
        },
      });
      return people.map((person) => {
        const pointTotal = person.PointEntry.reduce(
          (sum, entry) => sum + entry.points,
          0,
        );
        const totalEntries = person.PointEntry.length;
        const pointAverage = totalEntries === 0 ? 0 : pointTotal / totalEntries;

        return { ...person, pointTotal, totalEntries, pointAverage };
      });
    }),

  create: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.person.create({ data: { name: input } });
    }),
});

export type PersonWithPointTotals = Awaited<
  ReturnType<typeof personRouter.getAllWithPointTotal>
>[number];
