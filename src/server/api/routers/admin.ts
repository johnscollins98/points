import { z } from "zod";

import { createTRPCRouter, suProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getAllUsers: suProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  removeAdmin: suProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: input },
      data: {
        admin: false,
      },
    });
  }),

  addAdmin: suProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: input },
      data: {
        admin: true,
      },
    });
  }),
});
