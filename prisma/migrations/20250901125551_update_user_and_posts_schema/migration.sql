/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Posts" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "image",
ADD COLUMN     "category" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "profileImages" TEXT[],
ADD COLUMN     "schedule" TIMESTAMP(3)[];
