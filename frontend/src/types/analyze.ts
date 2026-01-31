export interface AnalyzeRequest {
    text: string;
}

export interface AnalyzeDocument {
    id: number;
    title: string;
    summary: string;
    tags: string[];
    createdAt: string;
}

export interface AnalyzeNode {
    id: number;
    label: string;
    summary: string;
    importance: number | null;
}

export interface AnalyzeEdge {
    from: string;
    to: string;
    relation: number;
    strength: number;
}

export interface AnalyzeResponse {
    document: AnalyzeDocument;
    node: AnalyzeNode[];
    edges: AnalyzeEdge[];
}