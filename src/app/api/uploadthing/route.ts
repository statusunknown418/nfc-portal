import { createRouteHandler } from "uploadthing/next";
import { uploadThingRouter } from "~/server/api/routers/upload-thing";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: uploadThingRouter,
  config: {
    logLevel: "debug",
  },
});
