/*
  Warnings:

  - You are about to alter the column `heightCm` on the `MemberProfile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - You are about to alter the column `weightKg` on the `MemberProfile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."MemberProfile" ALTER COLUMN "heightCm" SET DATA TYPE INTEGER,
ALTER COLUMN "weightKg" SET DATA TYPE INTEGER;
