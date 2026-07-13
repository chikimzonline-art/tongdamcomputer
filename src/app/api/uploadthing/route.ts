import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    /**
     * Explicitly set the callback URL so UploadThing's servers know where to
     * POST the onUploadComplete callback. In the cloud sandbox the automatic
     * detection resolves to the gateway URL, which UploadThing can't reach.
     * Setting this to localhost:3000 ensures the callback reaches our dev
     * server directly. Override with UPLOADTHING_CALLBACK_URL in production.
     */
    callbackUrl:
      process.env.UPLOADTHING_CALLBACK_URL ??
      "http://localhost:3000/api/uploadthing",
  },
});
