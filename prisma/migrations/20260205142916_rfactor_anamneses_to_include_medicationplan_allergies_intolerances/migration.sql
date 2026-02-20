/*
  Warnings:

  - You are about to drop the column `allergies` on the `MemberProfile` table. All the data in the column will be lost.
  - You are about to drop the column `intolerances` on the `MemberProfile` table. All the data in the column will be lost.
  - You are about to drop the column `medicationPlan` on the `MemberProfile` table. All the data in the column will be lost.

*/
-- Rename Constraint
ALTER TABLE "public"."MemberProfile" RENAME CONSTRAINT "PatientProfile_pkey" TO "MemberProfile_pkey";

-- AlterTable
ALTER TABLE "public"."MemberProfile" 
DROP COLUMN "allergies",
DROP COLUMN "intolerances",
DROP COLUMN "medicationPlan";

-- RenameIndex
ALTER INDEX "public"."PatientProfile_email_key" RENAME TO "MemberProfile_email_key";
