-- Step 1: Add familyMembers Json column to MemberProfile
ALTER TABLE "MemberProfile" ADD COLUMN "familyMembers" JSONB;

-- Step 2: Migrate existing FamilyMember data to JSON format
UPDATE "MemberProfile" mp
SET "familyMembers" = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'name', fm.name,
        'phones', CASE 
          WHEN fm.phone IS NOT NULL AND fm.phone != '' 
          THEN jsonb_build_array(fm.phone)
          ELSE '[]'::jsonb
        END
      )
    ),
    '[]'::jsonb
  )
  FROM "FamilyMember" fm
  WHERE fm."healthUserId" = mp.id
);

-- Step 3: Drop the FamilyMember table
DROP TABLE IF EXISTS "FamilyMember";
