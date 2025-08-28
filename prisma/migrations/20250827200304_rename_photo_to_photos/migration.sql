/*
  Warnings:

  - You are about to drop the column `photo` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Posts" DROP COLUMN "photo",
ADD COLUMN     "photos" TEXT[];
