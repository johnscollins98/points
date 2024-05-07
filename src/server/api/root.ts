import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { personRouter } from "./routers/person";
import { pointRouter } from "./routers/points";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  point: pointRouter,
  person: personRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
