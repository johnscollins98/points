import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const personRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.person.findMany();
    }),

  create: publicProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.person.create({ data: { name: input }})
    })
});
