from fastapi import FastAPI
from pydantic import BaseModel
from app.indexer import index_repo
from app.embedder import embed_text
from app.vector_store import search
from app.llm import generate_answer
from app.logger import log_query
from app.feedback import init_db, save_feedback
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Semantic Code Search API")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class IndexRequest(BaseModel):
    repo_url: str

class QueryRequest(BaseModel):
    question: str

class FeedbackRequest(BaseModel):
    question: str
    answer: str
    rating: int

@app.post("/index")
def index_endpoint(req: IndexRequest):
    result = index_repo(req.repo_url)
    return result

@app.post("/query")
def query_endpoint(req: QueryRequest):
    try:
        print("Received question:", req.question)
        start_time = time.time()

        query_vec = embed_text(req.question)
        results = search(query_vec, top_k=5)

        chunks = [
            {
                "file": m["file"],
                "name": m["name"],
                "start_line": m["start_line"],
                "code": d,
            }
            for d, m in zip(results["documents"][0], results["metadatas"][0])
        ]

        answer = generate_answer(req.question, chunks)
        end_time = time.time()
        log_query(req.question, end_time - start_time, len(chunks))
        return {"answer": answer, "sources": chunks}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise

@app.post("/feedback")
def feedback_endpoint(req: FeedbackRequest):

    save_feedback(
        req.question,
        req.answer,
        req.rating,
    )

    return {"message": "Feedback saved successfully"}

@app.get("/")
def health():
    return {"status": "running"}