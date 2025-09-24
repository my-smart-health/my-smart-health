/*
  Warnings:

  - Changed the type of `paragraph` on the `MySmartHealth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."MySmartHealth" DROP COLUMN "paragraph",
ADD COLUMN     "paragraph" JSONB NOT NULL;
