import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { linksRouter } from "./routers/links";
import { portalsRouter } from "./routers/portals";
import { viewersRouter } from "./routers/viewers";
import { vCardsRouter } from "./routers/v-card";
import { visualCustomizationRouter } from "./routers/visual";
import { purchasesRouter } from "./routers/purchase";
import { signaturesRouter } from "./routers/signatures";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  links: linksRouter,
  portals: portalsRouter,
  viewer: viewersRouter,
  vCard: vCardsRouter,
  visuals: visualCustomizationRouter,
  purchases: purchasesRouter,
  signatures: signaturesRouter,
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
