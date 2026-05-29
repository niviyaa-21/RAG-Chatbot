import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
from langchain_groq import ChatGroq
from rag import retrieve_chunks

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(model="llama-3.1-8b-instant", api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    question: str

SYSTEM_PROMPT = """You are an intelligent HR assistant for SWS AI.
Answer employee questions using the provided company document excerpts.
Format your response using markdown:
- Use **bold** for key terms, numbers, and policy names
- Use headers like **Sick Leave (SL)** for each section
- Use bullet points for lists
- Be detailed and thorough — cover all relevant policy points from the context
- Always mention specific numbers, dates, limits, and conditions
If the answer is not in the provided context, respond with: "I don't have that information in the company documents."""

@app.post("/api/chat")
async def chat(req: ChatRequest):
    # Step 1: Retrieve relevant chunks
    chunks = retrieve_chunks(req.question, k=5)

    # Step 2: Build context string
    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(
            f"[Source {i}: {chunk['source']}]\n{chunk['text']}"
        )
    context = "\n\n---\n\n".join(context_parts)

    # Step 3: Call local LLM
    prompt = f"""{SYSTEM_PROMPT}

Context from company documents:

{context}

---

Employee question: {req.question}

Please answer based only on the context above."""

    answer = llm.invoke(prompt).content

    # Step 4: Collect unique source names
    sources = list(dict.fromkeys(c["source"] for c in chunks))

    return {
        "answer": answer,
        "sources": sources,
        "chunks_used": len(chunks)
    }

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        dest = os.path.join("../documents", file.filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)
        os.system("python ingest.py")
        return {"success": True, "filename": file.filename}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/health")
def health():
    return {"status": "ok"}