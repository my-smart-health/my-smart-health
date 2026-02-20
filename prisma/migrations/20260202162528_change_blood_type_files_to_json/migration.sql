/*
  Warnings:

  - The `bloodTypeFiles` column on the `MemberProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."MemberProfile" 
DROP COLUMN "bloodTypeFiles",
ADD COLUMN     "bloodTypeFiles" JSONB;
