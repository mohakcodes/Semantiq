import { prisma } from '../../lib/prisma'
import { chunkText } from '../services/chunking.services';
import axios from 'axios'

const HF_EMBED_URL = process.env.HF_EMBED_URL!;

if (!process.env.HF_EMBED_URL) {
  throw new Error("❌ Missing HF_EMBED_URL in environment");
}

export const ingestText = async(req:Req,res:Res) => {
    try {
        const {title, text} = req.body;
        if(!title || !text){
            return res.status(400).json({ error: "Missing title or text" });
        }
        
        const document = await prisma.document.create({
            data: {
                title,
                rawText: text,
            }
        })

        const chunks = chunkText(text, 1000);

        const chunkData = [];
        for(const chunk of chunks){
            try {
                const response = await axios.post(
                    HF_EMBED_URL,
                    {text: chunk},
                    {
                        headers: { "Content-Type": "application/json"},
                        timeout: 30000
                    }
                )

                const embedding = response.data.embedding;
                if(!embedding || !Array.isArray(embedding)){
                    throw new Error("Invalid embedding response")
                }
                
                chunkData.push({
                    text: chunk,
                    embedding,
                    documentId: document.id
                })
            }
            catch (err: any) {
                console.error("❌ Embedding error for chunk:", err.message);    
            }
        }

        for(const chunk of chunkData){
            await prisma.$executeRawUnsafe(
                `INSERT INTO "TextChunk" (text, "documentId", embedding)
                VALUES ($1, $2, $3::vector)`,
                chunk.text,
                chunk.documentId,
                `[${chunk.embedding.join(",")}]`
            )
        }

        return res.json({
            message: "Document ingested successfully",
            documentId: document.id,
            chunks: chunkData.length,
        });
    } 
    catch (error: any) {
        console.error("❌ Full error in ingestText:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}