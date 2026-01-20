-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextChunk" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "aiSummary" TEXT,
    "embedding" BYTEA,

    CONSTRAINT "TextChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "summary" TEXT,
    "embedding" BYTEA,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" SERIAL NOT NULL,
    "fromNodeId" INTEGER NOT NULL,
    "toNodeId" INTEGER NOT NULL,
    "relationship" TEXT,
    "weight" DOUBLE PRECISION,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TextChunk" ADD CONSTRAINT "TextChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
