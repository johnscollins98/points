import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pointRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ 
      startDate: z.date().optional(), 
      endDate: z.date().optional(),
      filterPerson: z.string().min(1).optional()
    }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.pointEntry.findMany({ where: {
        date: {
          gte: input?.startDate,
          lte: input?.endDate
        },
        Person: {
          name: input?.filterPerson
        }
      }, include: { Person: true }, orderBy: { date: 'asc' } });
    }),

  create: publicProcedure
    .input(z.object({
      person: z.number().int(),
      points: z.number().int(),
      date: z.date().default(new Date()),
      wasDouble: z.boolean()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.pointEntry.create({ data: {
        date: input.date,
        points: input.points,
        Person: {
          connect: {
            id: input.person
          }
        },
        wasDouble: input.wasDouble
      }})
    })
});
