/*
  Warnings:

  - The `wikidataPersonId` column on the `ListEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `WikidataPerson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `WikidataPerson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ListEntry" DROP CONSTRAINT "ListEntry_wikidataPersonId_fkey";

-- AlterTable
ALTER TABLE "ListEntry" DROP COLUMN "wikidataPersonId",
ADD COLUMN     "wikidataPersonId" INTEGER;

-- AlterTable
ALTER TABLE "WikidataPerson" DROP CONSTRAINT "WikidataPerson_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "WikidataPerson_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_wikidataPersonId_fkey" FOREIGN KEY ("wikidataPersonId") REFERENCES "WikidataPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
