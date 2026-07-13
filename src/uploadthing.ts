import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";
import sharp from "sharp";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
 * Both enforce a 2MB limit, image-only mime types, and require an active
 * admin session — preventing unauthenticated uploads.
 */
export const ourFileRouter = {
  galleryUploader: f({
    image: { maxFileSize: MAX_SIZE, maxFileCount: 10 },
  })
    .input(z.object({ albumId: z.string().nullable().optional() }))
    .middleware(async ({ input }) => {
      // Require an authenticated admin session before allowing any upload.
      const session = await getServerSession(authOptions);
      if (!session) throw new UploadThingError("Unauthorized");

      return { albumId: input.albumId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      let width = 0;
      let height = 0;
      try {
        const response = await fetch(file.url);
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          const imgMetadata = await sharp(buffer).metadata();
          width = imgMetadata.width || 0;
          height = imgMetadata.height || 0;
        }
      } catch (e) {
        console.error("Failed to get image dimensions:", e);
      }

      try {
        await db.galleryImage.create({
          data: {
            url: file.url,
            key: file.key,
            name: file.name,
            width,
            height,
            albumId: metadata.albumId || null,
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
    .middleware(async () => {
      // Require an authenticated admin session before allowing any upload.
      const session = await getServerSession(authOptions);
      if (!session) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // The client reads the returned URL and updates SiteContent via
      // /api/admin/content. Nothing to persist here.
      return { url: file.url, key: file.key, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
