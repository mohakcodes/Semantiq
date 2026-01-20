import { prisma } from '../../lib/prisma'
import { chunkText } from '../services/chunking.services';

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

        await prisma.textChunk.createMany({
            data: chunks.map((chunk) => ({
                text: chunk,
                documentId: document.id
            }))
        })

        res.json({
            message: "Document ingested successfully",
            documentId: document.id,
            chunks: chunks.length,
        })    
    } 
    catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
}