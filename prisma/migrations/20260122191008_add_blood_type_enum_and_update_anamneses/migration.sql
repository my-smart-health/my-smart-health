-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- Add temporary column for bloodType
ALTER TABLE "MemberProfile" ADD COLUMN "bloodType_new" "BloodType";

-- Migrate existing bloodType data to enum
UPDATE "MemberProfile" 
SET "bloodType_new" = CASE 
    WHEN "bloodType" = 'A+' THEN 'A_POSITIVE'::"BloodType"
    WHEN "bloodType" = 'A-' THEN 'A_NEGATIVE'::"BloodType"
    WHEN "bloodType" = 'B+' THEN 'B_POSITIVE'::"BloodType"
    WHEN "bloodType" = 'B-' THEN 'B_NEGATIVE'::"BloodType"
    WHEN "bloodType" = 'AB+' THEN 'AB_POSITIVE'::"BloodType"
    WHEN "bloodType" = 'AB-' THEN 'AB_NEGATIVE'::"BloodType"
    WHEN "bloodType" = 'O+' THEN 'O_POSITIVE'::"BloodType"
    WHEN "bloodType" = 'O-' THEN 'O_NEGATIVE'::"BloodType"
    ELSE NULL
END
WHERE "bloodType" IS NOT NULL;

-- Drop old column and rename new one
ALTER TABLE "MemberProfile" DROP COLUMN "bloodType";
ALTER TABLE "MemberProfile" RENAME COLUMN "bloodType_new" TO "bloodType";

-- Add temporary column for anamneses
ALTER TABLE "MemberProfile" ADD COLUMN "anamneses_new" JSONB;

-- Migrate existing anamneses array data to JSON array of objects
UPDATE "MemberProfile" 
SET "anamneses_new" = (
    SELECT jsonb_agg(jsonb_build_object('text', elem, 'fileUrl', ''))
    FROM unnest("anamneses") AS elem
)
WHERE "anamneses" IS NOT NULL AND array_length("anamneses", 1) > 0;

-- Drop old column and rename new one
ALTER TABLE "MemberProfile" DROP COLUMN "anamneses";
ALTER TABLE "MemberProfile" RENAME COLUMN "anamneses_new" TO "anamneses";
