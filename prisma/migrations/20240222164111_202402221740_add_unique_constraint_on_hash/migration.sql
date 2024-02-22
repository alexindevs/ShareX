/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_hash_key" ON "File"("hash");
