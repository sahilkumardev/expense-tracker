-- AlterTable
ALTER TABLE "Category" ADD COLUMN "icon" TEXT;

-- Backfill icons for existing rows so per-user icon uniqueness can be enforced.
WITH ranked_categories AS (
  SELECT
    "id",
    "userId",
    ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt", "id") - 1 AS row_index
  FROM "Category"
)
UPDATE "Category" AS c
SET "icon" = CASE ranked_categories.row_index
  WHEN 0 THEN 'shopping-bag'
  WHEN 1 THEN 'house'
  WHEN 2 THEN 'car'
  WHEN 3 THEN 'utensils'
  WHEN 4 THEN 'briefcase'
  WHEN 5 THEN 'health'
  WHEN 6 THEN 'entertainment'
  WHEN 7 THEN 'education'
  WHEN 8 THEN 'travel'
  WHEN 9 THEN 'bills'
  ELSE 'shopping-bag-' || SUBSTRING(c."id" FROM 1 FOR 8)
END
FROM ranked_categories
WHERE c."id" = ranked_categories."id";

-- Enforce defaults/constraints for new rows.
ALTER TABLE "Category" ALTER COLUMN "icon" SET DEFAULT 'shopping-bag';
ALTER TABLE "Category" ALTER COLUMN "icon" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_icon_key" ON "Category"("userId", "icon");
