import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/server/auth";

const f = createUploadthing();

export const uploadThingRouter = {
  thumbnails: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({}) => {
      const session = await auth();

      if (!session) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

export type UploadthingFileRouter = typeof uploadThingRouter;
