/*
  Reverting to original schema structure - preserving data by copying from related tables
*/

-- Step 1: Add the new columns first with default values
ALTER TABLE "public"."User" ADD COLUMN "profileType" TEXT DEFAULT 'SMART_HEALTH';
ALTER TABLE "public"."User" ADD COLUMN "category" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Copy data from ProfileType table to profileType column
UPDATE "public"."User" 
SET "profileType" = pt.name 
FROM "public"."ProfileType" pt 
WHERE "User"."profileTypeId" = pt.id;

-- Step 3: Copy data from UserCategory/Category tables to category array column
UPDATE "public"."User" 
SET "category" = ARRAY(
  SELECT c.name 
  FROM "public"."UserCategory" uc 
  JOIN "public"."Category" c ON uc."categoryId" = c.id 
  WHERE uc."userId" = "User".id
);

-- Step 4: Make profileType column required (remove default)
ALTER TABLE "public"."User" ALTER COLUMN "profileType" SET NOT NULL;
ALTER TABLE "public"."User" ALTER COLUMN "profileType" DROP DEFAULT;

-- Step 5: Remove foreign key constraints
ALTER TABLE "public"."Category" DROP CONSTRAINT IF EXISTS "Category_parentId_fkey";
ALTER TABLE "public"."Category" DROP CONSTRAINT IF EXISTS "Category_profileTypeId_fkey";
ALTER TABLE "public"."User" DROP CONSTRAINT IF EXISTS "User_profileTypeId_fkey";
ALTER TABLE "public"."UserCategory" DROP CONSTRAINT IF EXISTS "UserCategory_categoryId_fkey";
ALTER TABLE "public"."UserCategory" DROP CONSTRAINT IF EXISTS "UserCategory_userId_fkey";

-- Step 6: Drop the old profileTypeId column
ALTER TABLE "public"."User" DROP COLUMN "profileTypeId";

-- Step 7: Drop the relational tables
DROP TABLE IF EXISTS "public"."UserCategory";
DROP TABLE IF EXISTS "public"."Category";
DROP TABLE IF EXISTS "public"."ProfileType";
