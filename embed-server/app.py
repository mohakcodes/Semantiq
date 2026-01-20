from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Semantiq Embedding Server")

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/embed")
async def embed_text(data: dict = Body(...)):
    text = data.get("text")
    if not text:
        return {"error": "Missing text"}
    vector = model.encode([text])[0].tolist()
    return {"embedding": vector}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)