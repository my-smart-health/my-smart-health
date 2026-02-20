/*
  Warnings:

  - You are about to drop the column `specialNumbers` on the `MemberProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."MemberProfile" DROP COLUMN "specialNumbers",
ADD COLUMN     "telMedicineNumbers" JSONB;
