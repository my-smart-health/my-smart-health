-- Step 1: Add new JSONB column for documents
ALTER TABLE "MemberProfile" ADD COLUMN "documents_new" JSONB;

-- Step 2: Migrate existing String[] data to JSON format [{url: string, description?: string}]
UPDATE "MemberProfile"
SET "documents_new" = (
  CASE 
    WHEN "documents" IS NOT NULL AND array_length("documents", 1) > 0
    THEN (
      SELECT jsonb_agg(
        jsonb_build_object('url', doc)
      )
      FROM unnest("documents") AS doc
    )
    ELSE NULL
  END
);

-- Step 3: Drop old documents column
ALTER TABLE "MemberProfile" DROP COLUMN "documents";

-- Step 4: Rename new column to documents
ALTER TABLE "MemberProfile" RENAME COLUMN "documents_new" TO "documents";
