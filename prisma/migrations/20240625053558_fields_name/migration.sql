/*
  Warnings:

  - You are about to drop the column `field` on the `Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "field",
ADD COLUMN     "fields" JSONB;
