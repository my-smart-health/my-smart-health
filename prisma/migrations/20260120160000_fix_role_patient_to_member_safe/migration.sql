-- AlterEnum
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typname = 'Role' AND e.enumlabel = 'PATIENT'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typname = 'Role' AND e.enumlabel = 'MEMBER'
  ) THEN
    ALTER TYPE "public"."Role" RENAME VALUE 'PATIENT' TO 'MEMBER';
  END IF;
END $$;

-- AlterTable
ALTER TABLE "public"."PatientProfile" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'USER';
