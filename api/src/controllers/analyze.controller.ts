import axios from "axios";
import { prisma } from "../../lib/prisma.js";
import {generateMetadata, extractNodes} from '../../lib/gemini.js'
import dotenv from "dotenv"

dotenv.config();

//Interfaces
interface NodeInput {
  label: string;
  summary: string;
  importance?: number;
}

interface NodeInsertResult {
  id: number;
  label: string;
  summary: string;
  importance: number | null;
  embedding?: number[];
}

type NodeWithEmbedding = NodeInsertResult & { embedding: number[] }; 

interface EdgeInput {
  from: string;
  to: string;
  relation: string;
  strength: number;
}

interface AnalyzeRequestBody {
  text: string;
}

const HF_EMBED_URL = process.env.HF_EMBED_URL;
if (!HF_EMBED_URL) throw new Error("Missing HF_EMBED_URL in environment variables");

async function getEmbedding(text: string): Promise<number[]>{
    try {
        const res = await axios.post(
            HF_EMBED_URL!,
            { text },
            {
                headers: {"Content-Type":"application/json"},
                timeout: 20000
            }
        );
        if(!res.data.embedding || !Array.isArray(res.data.embedding)){
            throw new Error("Invalid embedding format");
        }
        return res.data.embedding;
    }
    catch (error: any) {
        console.error("❌ Embedding generation failed:", error.message);
        throw new Error("Embedding generation failed");    
    }
}

function cosineSimilarity(a:number[], b:number[]): number {
    const dotAB = a.reduce((sum, ai, i) => sum + ai * b[i] ,0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dotAB / (magA*magB);
}

export const analyzeText = async(req: Req, res: Res) => {
    try {
        const { text } = req.body as AnalyzeRequestBody;
        if(!text || text.trim().length < 20){
            return res.status(400).json({ error: "Text too short or missing" });
        }

        console.log("🧠 Starting analysis for text length:", text.length);

        const {title, summary, tags} = await generateMetadata(text);

        const document = await prisma.document.create({
            data: { title, rawText: text, summary, tags },
        })

        const nodes: NodeInput[] = await extractNodes(text);
        console.log(`🧩 Extracted ${nodes.length} nodes`);

        const embeddings = await Promise.all(
            nodes.map((node) => getEmbedding(`${node.label}. ${node.summary}`))
        );

        const values = nodes.map((node, idx) => {
            const emb = `[${embeddings[idx].join(",")}]`;
            const label = node.label.replace(/'/g, "''");
            const summary = node.summary.replace(/'/g, "''");
            return `(${document.id}, '${label}', '${summary}', ${node.importance ?? 0}, '${emb}'::vector)`;
        }).join(", ");

        const inserted = await prisma.$queryRawUnsafe<NodeInsertResult[]>(`
            INSERT INTO "Node" ("documentId","label","summary","importance","embedding")
            VALUES ${values}
            RETURNING id, "label", "summary", "importance"
        `)

        const nodeRecords: NodeWithEmbedding[] = inserted.map(
            (rec: NodeInsertResult, idx: number) => ({
            ...rec,
            embedding: embeddings[idx]
        }))

        const edges: EdgeInput[] = [];

        for(let i=0; i<nodeRecords.length; i++){
            for(let j=i+1; j<nodeRecords.length; j++){
                const similarity = cosineSimilarity(
                    nodeRecords[i].embedding!,
                    nodeRecords[j].embedding!
                )
                if(similarity > 0.5){
                    edges.push({
                        from: nodeRecords[i].label,
                        to: nodeRecords[j].label,
                        relation: "similar",
                        strength: parseFloat(similarity.toFixed(3))
                    })   
                }
            }
        }

        const topEdges = edges.sort((a,b) => b.strength - a.strength).slice(0,10);

        const perNodeTopEdges: EdgeInput[] = [];

        for(const node of nodeRecords){
            const relatedEdges = edges
            .filter((edge) => edge.from === node.label || edge.to === node.label)
            .sort((a,b) => b.strength - a.strength)
            .slice(0,2);
            perNodeTopEdges.push(...relatedEdges)
        }

        //merge both + dedupes
        const edgeMap = new Map<string, EdgeInput>();

        function edgeKey(edge: EdgeInput){
            return [edge.from, edge.to].sort().join('|')
        }

        for(const edge of topEdges){
            edgeMap.set(edgeKey(edge),edge)
        }

        for(const edge of perNodeTopEdges){
            const key = edgeKey(edge);
            if(!edgeMap.has(key)){
                edgeMap.set(key, edge);
            }
        }

        const mainEdges = Array.from(edgeMap.values())

        const edgeRecords = [];
        for(const edge of mainEdges) {
            const fromNode = nodeRecords.find((node) => node.label === edge.from)
            const toNode = nodeRecords.find((node) => node.label === edge.to)
            if(!fromNode || !toNode) continue;

            const createdEdge = await prisma.edge.create({
                data: {
                    fromNodeId: fromNode.id,
                    toNodeId: toNode.id,
                    relation: edge.relation,
                    strength: edge.strength,
                }
            });
            edgeRecords.push(createdEdge);
        }
        console.log(`🔗 Created ${edgeRecords.length} cosine-based edges`);

        return res.json({
            document: {
                id: document.id,
                title: document.title,
                summary: document.summary,
                tags: document.tags,
                createdAt: document.createdAt,
            },
            nodes: nodeRecords.map((node) => ({
                id: node.id,
                label: node.label,
                summary: node.summary,
                importance: node.importance,
            })),
            edges: edgeRecords.map((edge) => ({
                from: nodeRecords.find((node) => node.id === edge.fromNodeId)?.label,
                to: nodeRecords.find((node) => node.id === edge.toNodeId)?.label,
                relation: edge.relation,
                strength: edge.strength,
            }))
        })
    }
    catch (error: any) {
        console.error("❌ Error in analyzeText:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });    
    }
}