/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Viewer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Viewer_address_key" ON "Viewer"("address");
