/*
  Warnings:

  - You are about to drop the column `relationship` on the `Edge` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Edge` table. All the data in the column will be lost.
  - You are about to drop the `TextChunk` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `summary` on table `Node` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TextChunk" DROP CONSTRAINT "TextChunk_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Edge" DROP COLUMN "relationship",
DROP COLUMN "weight",
ADD COLUMN     "relation" TEXT,
ADD COLUMN     "strength" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "importance" DOUBLE PRECISION,
ALTER COLUMN "summary" SET NOT NULL;

-- DropTable
DROP TABLE "TextChunk";
