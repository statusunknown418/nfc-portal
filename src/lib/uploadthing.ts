import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import { type UploadthingFileRouter } from "~/server/api/routers/upload-thing";

export const UploadButton = generateUploadButton<UploadthingFileRouter>();
export const UploadDropzone = generateUploadDropzone<UploadthingFileRouter>();
