-- Drop and recreate as pgvector

ALTER TABLE "Node" DROP COLUMN IF EXISTS "embedding";
ALTER TABLE "Node" ADD COLUMN "embedding" vector(768);

ALTER TABLE "TextChunk" DROP COLUMN IF EXISTS "embedding";
ALTER TABLE "TextChunk" ADD COLUMN "embedding" vector(768);