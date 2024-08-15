import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import { UploadthingFileRouter } from "~/server/api/routers/upload-thing";

export const UploadButton = generateUploadButton<UploadthingFileRouter>();
export const UploadDropzone = generateUploadDropzone<UploadthingFileRouter>();
