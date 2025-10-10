/*
  Warnings:

  - You are about to drop the column `category` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileType` on the `User` table. All the data in the column will be lost.

*/
-- First, add the new profileTypeId column without dropping the old ones yet
ALTER TABLE "public"."User" ADD COLUMN "profileTypeId" TEXT;

-- CreateTable
CREATE TABLE "public"."ProfileType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "parentId" TEXT,
    "profileTypeId" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileType_name_key" ON "public"."ProfileType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_profileTypeId_key" ON "public"."Category"("name", "profileTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCategory_userId_categoryId_key" ON "public"."UserCategory"("userId", "categoryId");

-- Insert ProfileType records
INSERT INTO "public"."ProfileType" ("id", "name", "displayName", "icon", "description", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'SMART_HEALTH', 'Smart Health', '/icon3.png', 'Smart Health professionals and services', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'MEDIZIN_UND_PFLEGE', 'Medizin & Pflege', '/icon4.png', 'Medical professionals and healthcare providers', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Migrate existing users to new ProfileType system
UPDATE "public"."User" 
SET "profileTypeId" = (SELECT "id" FROM "public"."ProfileType" WHERE "name" = 'SMART_HEALTH')
WHERE "profileType" = 'SMART_HEALTH';

UPDATE "public"."User" 
SET "profileTypeId" = (SELECT "id" FROM "public"."ProfileType" WHERE "name" = 'MEDIZIN_UND_PFLEGE')
WHERE "profileType" = 'MEDIZIN_UND_PFLEGE';

-- Set default profileType for any remaining users
UPDATE "public"."User" 
SET "profileTypeId" = (SELECT "id" FROM "public"."ProfileType" WHERE "name" = 'SMART_HEALTH')
WHERE "profileTypeId" IS NULL;

-- Create categories from existing user data and link users to them
DO $$
DECLARE
    user_record RECORD;
    category_name TEXT;
    category_id UUID;
    profile_type_id UUID;
BEGIN
    -- Loop through all users who have categories
    FOR user_record IN 
        SELECT "id", "category", "profileTypeId" 
        FROM "public"."User" 
        WHERE "category" IS NOT NULL AND array_length("category", 1) > 0
    LOOP
        -- Loop through each category for this user
        FOR i IN 1..array_length(user_record."category", 1) 
        LOOP
            category_name := trim(user_record."category"[i]);
            
            IF category_name != '' THEN
                -- Check if category already exists for this profile type
                SELECT "id" INTO category_id 
                FROM "public"."Category" 
                WHERE "name" = category_name AND "profileTypeId" = user_record."profileTypeId";
                
                -- If category doesn't exist, create it
                IF category_id IS NULL THEN
                    INSERT INTO "public"."Category" ("id", "name", "displayName", "profileTypeId", "isActive", "sortOrder", "createdAt", "updatedAt")
                    VALUES (gen_random_uuid(), category_name, category_name, user_record."profileTypeId", true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    RETURNING "id" INTO category_id;
                END IF;
                
                -- Link user to category (ignore if already exists)
                INSERT INTO "public"."UserCategory" ("id", "userId", "categoryId", "createdAt")
                VALUES (gen_random_uuid(), user_record."id", category_id, CURRENT_TIMESTAMP)
                ON CONFLICT ("userId", "categoryId") DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Now drop the old columns
ALTER TABLE "public"."User" DROP COLUMN "category";
ALTER TABLE "public"."User" DROP COLUMN "profileType";

-- Add foreign key constraints
ALTER TABLE "public"."User" ADD CONSTRAINT "User_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES "public"."ProfileType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES "public"."ProfileType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCategory" ADD CONSTRAINT "UserCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCategory" ADD CONSTRAINT "UserCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
