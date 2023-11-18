/*
  Warnings:

  - You are about to drop the column `Fields` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "Fields",
ADD COLUMN     "fields" JSONB;
