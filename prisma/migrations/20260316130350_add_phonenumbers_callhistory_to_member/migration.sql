-- AlterTable
ALTER TABLE "public"."MemberProfile" ADD COLUMN     "callHistory" JSONB,
ADD COLUMN     "phoneNumbers" TEXT[];
