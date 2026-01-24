import {GoogleGenAI} from '@google/genai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if(!GEMINI_API_KEY) {
    throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenAI({apiKey:GEMINI_API_KEY})

const NO_CHAT_MODE = `
    ---
    INSTRUCTION:
    You are in DATA-ONLY mode.
    - Respond ONLY with the requested content.
    - Do NOT include introductions like "Sure", "Here's the answer", etc.
    - Do NOT include conclusions, questions, or follow-ups like "Would you like more info?"
    - Do NOT explain your reasoning.
    - Do NOT wrap output in markdown, code blocks, or quotes.
    - Output exactly what was asked for — nothing more.
`;

async function askGemini(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: `${prompt}\n${NO_CHAT_MODE}`,
    })

    const text = response.text ?? "";
    return text.trim();
}

export async function generateMetadata(text:string): Promise<{title:string; summary:string; tags:string[]}> {
    const raw = await askGemini(`
        Analyze this text and return a concise JSON object with:
        {
            "title": "short meaningful title (3–6 words)",
            "summary": "2–3 sentence summary of the main ideas",
            "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
        }
        Respond ONLY with valid JSON.
        Text: """${text}"""    
    `);

    try {
        const json = await extractJSON(raw);
        return {
            title: json.title || "Untitled Document",
            summary: json.summary || "",
            tags: Array.isArray(json.tags) 
                    ? json.tags.map((t:string) => t.toLowerCase().trim()) 
                    : []
        }
    } 
    catch {
        console.warn("⚠️ Failed to parse metadata JSON, fallback defaults.");
        return { title: "Untitled Document", summary: "", tags: [] };
    }
}

export async function extractNodes(text: string): Promise<{label: string; summary: string; importance: number}[]>
{
    const raw = await askGemini(`
        Task: Perform a deep **Concept Extraction** from the provided text.

        Objective:
        Identify the primary **Atomic Nodes** — self-contained units of meaning such as:
        - Core concepts or theories
        - Specific mechanisms, entities, or technologies
        - Proper nouns or domain-specific terms
        - Distinct phenomena or frameworks

        Strict Rules:
        1. ❌ Do NOT include generic or structural terms (e.g., "introduction", "overview", "results").
        2. 🎯 Use precise academic, technical, or professional terminology found directly in the text.
        3. 🧩 Each label must be a noun or noun phrase — not a sentence.
        4. 🏗️ Prefer concrete or specific concepts (e.g., "CRISPR-Cas9" > "Genetic Engineering").
        5. 📏 Keep the summary to exactly two concise lines describing what the concept represents or does.
        6. 🔢 Assign an "importance" score between 0.0 and 1.0 based on conceptual relevance.

        Output Format: Return **only** a valid JSON array of objects like:
        [
            {
                "label": "Artificial Intelligence",
                "summary": "Field focused on simulating intelligent behavior in machines. Encompasses reasoning, learning, and perception.",
                "importance": 0.97
            },
            {
                "label": "Machine Learning",
                "summary": "A subset of AI that trains algorithms to identify patterns and make predictions from data.",
                "importance": 0.93
            }
        ]

        Text: """${text}"""
    `);

    try {
        return extractJSONArray(raw);
    }
    catch (error) {
        console.warn("⚠️ Failed to parse Gemini node JSON, fallback empty array.");
        return [];
    }
}

function extractJSON(raw: string): any{
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if(start === -1 || end === -1) throw new Error("Invalid JSON Structure");
    return JSON.parse(raw.slice(start, end+1));
}

function extractJSONArray(raw: string) {
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("Invalid array JSON structure");
    return JSON.parse(raw.slice(start, end+1));
}