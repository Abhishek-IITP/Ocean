import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Dynamic import so that importing this module (e.g. for
      // extractRouterConfig in the root layout) does NOT pull in
      // the Prisma client at build time.
      const { requireUser } = await import("@/app/lib/hook");
      const session = await requireUser();
      if (!session.user?.id) throw new UploadThingError("Unauthorized");
      return { userId: session.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
