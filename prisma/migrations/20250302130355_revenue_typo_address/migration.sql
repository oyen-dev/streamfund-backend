/*
  Warnings:

  - You are about to drop the column `adddress` on the `Revenue` table. All the data in the column will be lost.
  - Added the required column `address` to the `Revenue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "adddress",
ADD COLUMN     "address" TEXT NOT NULL;
