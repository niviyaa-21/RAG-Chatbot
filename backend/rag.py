from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma

CHROMA_DIR = "./chroma_db"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = Chroma(
    persist_directory=CHROMA_DIR,
    embedding_function=embeddings,
    collection_name="sws_ai_docs"
)

def retrieve_chunks(question: str, k: int = 5):
    results = vectorstore.similarity_search_with_score(question, k=k)
    chunks = []
    for doc, score in results:
        chunks.append({
            "text": doc.page_content,
            "source": doc.metadata.get("source", "Unknown"),
            "page": doc.metadata.get("page", 0),
            "score": round(float(score), 4)
        })
    return chunks