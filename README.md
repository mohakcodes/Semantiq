# Semantiq

Semantiq is a **full‑stack semantic intelligence system** that transforms unstructured text into a structured, explorable **knowledge graph**.  
It helps users move from *confusion → clarity* by revealing concepts, relationships, and hidden structure inside complex information.

---

## ✨ Key Capabilities

- 🧠 AI‑driven concept extraction from raw text
- 🔗 Automatic relationship discovery using vector similarity
- 📊 Interactive, force‑directed graph visualization
- 🗂 Persistent storage of semantic graphs
- ⚡ Real‑time analysis with production‑ready backend
- 🎨 High‑end, motion‑driven UI for better cognitive experience

---

## 🧩 How It Works (End‑to‑End Pipeline)

Semantiq processes text through a multi‑stage semantic pipeline:

1. **Text Input**  
   Users submit raw text (notes, thoughts, articles, documentation).

2. **Metadata Generation (Gemini)**  
   Google Gemini generates:
   - A concise title  
   - A short semantic summary  
   - Relevant topical tags  

3. **Concept (Node) Extraction**  
   Gemini extracts *atomic semantic units*:
   - Concept label  
   - 2‑line explanation  
   - Importance score (0–1)

4. **Embedding Generation (Hugging Face)**  
   Each concept is converted into a **384‑dimensional embedding vector** capturing semantic meaning.

5. **Relationship Discovery (Cosine Similarity)**  
   All embeddings are compared pairwise using cosine similarity.

6. **Edge Selection Strategy (Noise Control)**  
   To prevent graph overcrowding:
   - Top **10 strongest edges globally**
   - Plus **top 2 strongest edges per node**
   - Deduplicated into a final edge set

7. **Persistence Layer**  
   All data is stored in PostgreSQL using:
   - Prisma ORM
   - `pgvector` for efficient vector storage

8. **Visualization**  
   The frontend renders an interactive semantic graph using Cytoscape.js.

---

## ⚖ Design Decisions

- Model specialization: Gemini for reasoning, Hugging Face for embeddings  
- Cosine similarity chosen for semantic alignment  
- Edge pruning balances clarity vs completeness  
- PostgreSQL + pgvector simplifies infrastructure  
- Client‑side graph rendering favors interaction over massive scale

---

## 📐 Why Cosine Similarity?

Cosine similarity measures **directional alignment** between vectors, not magnitude.  
This makes it ideal for semantic embeddings where meaning matters more than length.

---

## 🧱 Technology Stack

### Frontend
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Cytoscape.js

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM

### Database
- PostgreSQL
- pgvector extension

### AI Services
- Google Gemini
- Hugging Face Inference API

---

## 📁 Project Structure

```
Semantiq/
├── api/
├── frontend/
└── README.md
```

---

## 🚀 Local Development

### Backend

```bash
cd api
npm install
npx prisma migrate deploy
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
