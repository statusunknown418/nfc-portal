import { getAuth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";
import { db } from "~/server/db";
import { links, users } from "~/server/db/schema";

const f = createUploadthing();
export const utAPI = new UTApi();

export const uploadThingRouter = {
  thumbnails: f({ image: { maxFileSize: "4MB", minFileCount: 1, maxFileCount: 1 } })
    .input(
      z.object({
        linkId: z.number().optional(),
      }),
    )
    .middleware(async ({ input, req }) => {
      const session = getAuth(req);

      if (!session.userId) throw new UploadThingError("Unauthorized");

      return { userId: session.userId, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (!metadata.linkId) return { uploadedBy: metadata.userId, url: file.url };

      await db
        .update(links)
        .set({ thumbnail: file.url })
        .where(and(eq(links.id, metadata.linkId), eq(links.userId, metadata.userId)));

      return { uploadedBy: metadata.userId, url: file.url, linkedTo: metadata.linkId };
    }),

  avatars: f({ image: { maxFileSize: "4MB", minFileCount: 1, maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = getAuth(req);

      if (!session.sessionClaims?.userId) throw new UploadThingError("Unauthorized");

      return { userId: session.sessionClaims.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.update(users).set({ image: file.url }).where(eq(users.id, metadata.userId));

      return { uploadedBy: metadata.userId, url: file.url };
    }),
  logos: f({ image: { maxFileSize: "16MB", minFileCount: 1, maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = getAuth(req);

      if (!session.sessionClaims?.userId) throw new UploadThingError("Unauthorized");

      return { userId: session.sessionClaims.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  cardDesigns: f({ image: { maxFileSize: "4MB", minFileCount: 1, maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = getAuth(req);

      if (!session.sessionClaims?.userId) throw new UploadThingError("Unauthorized");

      return { userId: session.sessionClaims.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

export type UploadthingFileRouter = typeof uploadThingRouter;
