# SWS AI HR Policy Chatbot

A Retrieval-Augmented Generation (RAG) based chatbot that answers employee questions about company HR policies using internal PDF documents.

---

## What it does

Employees can ask natural language questions like *"How many sick leaves do I get?"* or *"What is the WFH policy?"* and get accurate answers sourced directly from company documents — not from the AI's general knowledge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Backend | FastAPI, Python |
| LLM | Groq (llama-3.1-8b-instant) |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 |
| Vector DB | ChromaDB |
| PDF Loader | LangChain + PyPDF |

---

## How it works

```
User Question
     ↓
ChromaDB → Find top 5 relevant chunks from PDFs
     ↓
Build prompt with chunks as context
     ↓
Groq LLM → Generate answer based only on context
     ↓
Return answer + source document names
```

---

## Project Structure

```
RAG-Chatbot/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── rag.py           # Vector search logic
│   ├── ingest.py        # PDF ingestion script
│   ├── requirements.txt
│   └── .env             # API keys (not committed)
├── documents/           # Company PDF files
│   ├── SWS-AI-leave-policy.pdf
│   ├── SWS-AI-wfh-policy.pdf
│   ├── SWS-AI-hr-policy.pdf
│   └── ... (10 PDFs total)
└── frontend/
    ├── src/
    │   └── App.jsx      # Chat UI
    └── package.json
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/niviyaa-21/RAG-Chatbot.git
cd RAG-Chatbot
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
pip install langchain-groq langchain-huggingface langchain-text-splitters
```

Create a `.env` file in the `backend/` folder:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Ingest documents
```bash
python ingest.py
```
This reads all PDFs, splits them into chunks, generates embeddings, and stores them in ChromaDB. Run this once.

### 4. Start the backend
```bash
python -m uvicorn main:app --reload --port 8000
```

### 5. Start the frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Documents Covered

- Leave Policy
- WFH Policy
- HR Policy
- Benefits & Compensation
- Code of Conduct
- Company Overview
- IT Security Policy
- Onboarding Guide
- Performance Review
- Resignation Policy

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send a question, get an answer |
| GET | `/health` | Health check |

### Example request
```json
POST /api/chat
{
  "question": "How many sick leaves do I get?"
}
```

### Example response
```json
{
  "answer": "Employees are entitled to 10 sick leaves per year...",
  "sources": ["SWS-AI-leave-policy.pdf"],
  "chunks_used": 5
}
```
