/*
  Warnings:

  - You are about to drop the column `convertedAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeRate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "convertedAmount",
DROP COLUMN "currencyId",
DROP COLUMN "exchangeRate";

-- DropTable
DROP TABLE "Currency";

-- DropTable
DROP TABLE "UserSettings";
