/*
  Warnings:

  - You are about to drop the column `type` on the `Revenue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TransactionType";
