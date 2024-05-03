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
      }, include: { Person: true }, orderBy: { date: 'desc' } });
    }),

    update: publicProcedure
      .input(z.object({
        id: z.number().int(),
        personId: z.number().int(),
        points: z.number().int(),
        date: z.date().default(new Date()),
        wasDouble: z.boolean()
      }))
      .mutation(({ ctx, input }) => {
        return ctx.db.pointEntry.update({ data: {
          date: input.date,
          points: input.points,
          Person: {
            connect: {
              id: input.personId
            }
          },
          wasDouble: input.wasDouble
        }, where: { id: input.id }})
      }),

  create: publicProcedure
    .input(z.object({
      personId: z.number().int(),
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
            id: input.personId
          }
        },
        wasDouble: input.wasDouble
      }})
    }),

  deleteById: publicProcedure
    .input(z.number().int())
    .mutation(({ ctx, input }) => {
      return ctx.db.pointEntry.delete({ where: { id: input }})
    })
});
