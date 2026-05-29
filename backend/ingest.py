import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

load_dotenv()

DOCS_DIR = "../documents"
CHROMA_DIR = "./chroma_db"

def ingest():
    print("Loading PDFs...")
    all_docs = []

    for filename in os.listdir(DOCS_DIR):
        if filename.endswith(".pdf"):
            path = os.path.join(DOCS_DIR, filename)
            loader = PyPDFLoader(path)
            pages = loader.load()
            # Tag each chunk with the source filename
            for page in pages:
                page.metadata["source"] = filename
            all_docs.extend(pages)
            print(f"  Loaded: {filename} ({len(pages)} pages)")

    print(f"\nTotal pages loaded: {len(all_docs)}")

    # Chunk the text
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_documents(all_docs)
    print(f"Total chunks created: {len(chunks)}")

    # Use a free local embedding model (no API key needed)
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    # Store in ChromaDB
    print("\nStoring in ChromaDB...")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
        collection_name="sws_ai_docs"
    )

    print(f"Done! {len(chunks)} chunks stored in ChromaDB.")
    print(f"Test query result:")
    results = vectorstore.similarity_search("What is the leave policy?", k=3)
    for r in results:
        print(f"  [{r.metadata['source']}] {r.page_content[:100]}...")

if __name__ == "__main__":
    ingest()