DO $$
BEGIN
  -- Only rename if old exists and new doesn't
  IF to_regclass('public."PatientProfile"') IS NOT NULL
     AND to_regclass('public."MemberProfile"') IS NULL THEN
    EXECUTE 'ALTER TABLE "public"."PatientProfile" RENAME TO "MemberProfile"';
  END IF;
END $$;
