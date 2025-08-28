-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" VARCHAR(20)[],
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "public"."Socials" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platform" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Socials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Socials" ADD CONSTRAINT "Socials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
