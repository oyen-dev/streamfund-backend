/*
  Warnings:

  - Added the required column `symbol` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "symbol" TEXT NOT NULL;
