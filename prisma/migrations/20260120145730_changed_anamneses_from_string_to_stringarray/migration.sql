-- AlterTable
ALTER TABLE "public"."PatientProfile" DROP COLUMN "anamneses",
ADD COLUMN     "anamneses" TEXT[] DEFAULT ARRAY[]::TEXT[];
