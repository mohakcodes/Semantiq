/*
  Warnings:

  - Made the column `embedding` on table `TextChunk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "embedding" vector(768);

-- AlterTable
ALTER TABLE "TextChunk" ALTER COLUMN "embedding" SET NOT NULL;
