// IMPORTS -
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  return { userId: true };
};

export const ourFileRouter = {
  serverImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
  .middleware(() => handleAuth())
  .onUploadComplete(() => {}),
  messageFile: f(["image"])
  .middleware(() => handleAuth())
  .onUploadComplete(() => {})

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;