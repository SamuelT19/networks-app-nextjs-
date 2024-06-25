/*
  Warnings:

  - You are about to drop the column `fields` on the `Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "fields",
ADD COLUMN     "field" JSONB;
