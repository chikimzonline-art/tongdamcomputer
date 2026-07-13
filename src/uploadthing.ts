import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { db } from "@/lib/db";

const f = createUploadthing();

const MAX_SIZE = "2MB";

/**
 * UploadThing file router for the Tongdam Computers site.
 *
 * Two endpoints:
 *  - `galleryUploader` — for the gallery page. Accepts an optional `albumId`
 *    input so uploaded images can be associated with an album. Each uploaded
 *    image is inserted as a GalleryImage row in the DB (server-side, in
 *    onUploadComplete).
 *  - `assetUploader` — for site assets (logo / favicon). The uploaded URL is
 *    returned to the client, which then PUTs it to /api/admin/content.
 *
 * Both enforce a 2MB limit and image-only mime types.
 */
export const ourFileRouter = {
  galleryUploader: f({
    image: { maxFileSize: MAX_SIZE, maxFileCount: 10 },
  })
    .input(z.object({ albumId: z.string().nullable().optional() }))
    // No middleware — the admin route guard is handled at the page level.
    .onUploadComplete(async ({ file, input }) => {
      try {
        await db.galleryImage.create({
          data: {
            url: file.url,
            key: file.key,
            name: file.name,
            width: 0,
            height: 0,
            albumId: input?.albumId || null,
          },
        });
      } catch (e) {
        console.error("Failed to save gallery image to DB:", e);
        throw new UploadThingError("Failed to save image metadata");
      }
      return { url: file.url, key: file.key, name: file.name };
    }),

  assetUploader: f({
    image: { maxFileSize: MAX_SIZE, maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      // The client reads the returned URL and updates SiteContent via
      // /api/admin/content. Nothing to persist here.
      return { url: file.url, key: file.key, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
