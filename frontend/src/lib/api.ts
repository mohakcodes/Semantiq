import { AnalyzeRequest, AnalyzeResponse } from "@/types/analyze";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export async function analyzeText(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
    const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if(!res.ok){
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Analysis failed");
    }

    return res.json();
}