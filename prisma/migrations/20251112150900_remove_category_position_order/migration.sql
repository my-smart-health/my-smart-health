-- Drop index referencing the removed order column if it exists
DROP INDEX IF EXISTS "CategoryUser_categoryId_order_idx";

-- Remove the optional order column from CategoryUser
ALTER TABLE "CategoryUser"
  DROP COLUMN IF EXISTS "order";

-- Remove the unused position column from Category
ALTER TABLE "Category"
  DROP COLUMN IF EXISTS "position";
