/*
  Warnings:

  - You are about to drop the `Socials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Socials" DROP CONSTRAINT "Socials_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "socials" TEXT[],
ALTER COLUMN "phone" SET DATA TYPE TEXT[];

-- DropTable
DROP TABLE "public"."Socials";
