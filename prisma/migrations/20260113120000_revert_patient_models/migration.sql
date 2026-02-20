-- Drop 2026 patient-related tables
DROP TABLE IF EXISTS "public"."PatientDoctor" CASCADE;
DROP TABLE IF EXISTS "public"."FamilyMember" CASCADE;
DROP TABLE IF EXISTS "public"."PatientProfile" CASCADE;

-- Recreate Role enum without PATIENT
CREATE TYPE "public"."Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'USER';
DROP TYPE "public"."Role_old";
