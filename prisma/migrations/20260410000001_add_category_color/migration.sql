-- AlterTable
ALTER TABLE "Category" ADD COLUMN "color" TEXT;

UPDATE "Category"
SET "color" = 'blue'
WHERE "color" IS NULL;

ALTER TABLE "Category" ALTER COLUMN "color" SET DEFAULT 'blue';
ALTER TABLE "Category" ALTER COLUMN "color" SET NOT NULL;
