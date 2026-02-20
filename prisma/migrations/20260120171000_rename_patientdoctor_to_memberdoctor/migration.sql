-- 1) Rename table
DO $$
BEGIN
  IF to_regclass('public."PatientDoctor"') IS NOT NULL
     AND to_regclass('public."MemberDoctor"') IS NULL THEN
    EXECUTE 'ALTER TABLE "public"."PatientDoctor" RENAME TO "MemberDoctor"';
  END IF;
END $$;

-- 2) Rename column patientId -> memberId
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'MemberDoctor'
      AND column_name = 'patientId'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'MemberDoctor'
      AND column_name = 'memberId'
  ) THEN
    EXECUTE 'ALTER TABLE "public"."MemberDoctor" RENAME COLUMN "patientId" TO "memberId"';
  END IF;
END $$;

-- 3) Rename indexes to Prisma-default names
DO $$
BEGIN
  IF to_regclass('public."PatientDoctor_patientId_doctorId_key"') IS NOT NULL
     AND to_regclass('public."MemberDoctor_memberId_doctorId_key"') IS NULL THEN
    EXECUTE 'ALTER INDEX "public"."PatientDoctor_patientId_doctorId_key" RENAME TO "MemberDoctor_memberId_doctorId_key"';
  END IF;

  IF to_regclass('public."PatientDoctor_patientId_idx"') IS NOT NULL
     AND to_regclass('public."MemberDoctor_memberId_idx"') IS NULL THEN
    EXECUTE 'ALTER INDEX "public"."PatientDoctor_patientId_idx" RENAME TO "MemberDoctor_memberId_idx"';
  END IF;

  IF to_regclass('public."PatientDoctor_doctorId_idx"') IS NOT NULL
     AND to_regclass('public."MemberDoctor_doctorId_idx"') IS NULL THEN
    EXECUTE 'ALTER INDEX "public"."PatientDoctor_doctorId_idx" RENAME TO "MemberDoctor_doctorId_idx"';
  END IF;
END $$;

-- 4) Rename constraints (PK + FKs) to Prisma-default names
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PatientDoctor_pkey'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MemberDoctor_pkey'
  ) THEN
    EXECUTE 'ALTER TABLE "public"."MemberDoctor" RENAME CONSTRAINT "PatientDoctor_pkey" TO "MemberDoctor_pkey"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PatientDoctor_patientId_fkey'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MemberDoctor_memberId_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE "public"."MemberDoctor" RENAME CONSTRAINT "PatientDoctor_patientId_fkey" TO "MemberDoctor_memberId_fkey"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PatientDoctor_doctorId_fkey'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'MemberDoctor_doctorId_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE "public"."MemberDoctor" RENAME CONSTRAINT "PatientDoctor_doctorId_fkey" TO "MemberDoctor_doctorId_fkey"';
  END IF;
END $$;
