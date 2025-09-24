/*
  Warnings:

  - You are about to drop the column `files` on the `MySmartHealth` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `MySmartHealth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."MySmartHealth" DROP COLUMN "files",
DROP COLUMN "images";
