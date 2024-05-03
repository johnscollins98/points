import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pointRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ 
      filterDate: z.date().optional(), 
      filterPerson: z.string().min(1).optional()
    }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.pointEntry.findMany({ where: {
        date: input?.filterDate,
        Person: {
          name: input?.filterPerson
        }
      }, include: { Person: true }});
    }),

  create: publicProcedure
    .input(z.object({
      person: z.number().int(),
      points: z.number().int(),
      itemNumber: z.number(),
      date: z.date().default(new Date()),
      wasDouble: z.boolean()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.pointEntry.create({ data: {
        date: input.date,
        itemNumber: input.itemNumber,
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
