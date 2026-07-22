from app.chunker import chunk_repo
from app.embedder import embed_batch, embed_text
from app.vector_store import add_chunks, search

# 1. Chunk the repo
print("Chunking repo...")
chunks = chunk_repo("../sample_repo")
print(f"Found {len(chunks)} chunks")

# 2. Embed all chunks
print("Generating embeddings...")
texts = [c["code"] for c in chunks]
embeddings = embed_batch(texts)

# 3. Store in vector DB
print("Storing in ChromaDB...")
add_chunks(chunks, embeddings)

# 4. Test a query
query = "how does the app handle routing for a URL?"
query_vec = embed_text(query)
results = search(query_vec, top_k=3)

print("\n--- Top matches ---")
for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
    print(f"\n📄 {meta['file']} :: {meta['name']} (line {meta['start_line']})")
    print(doc[:300])


from app.llm import generate_answer

top_chunks = [
    {"file": m["file"], "name": m["name"], "start_line": m["start_line"], "code": d}
    for d, m in zip(results["documents"][0], results["metadatas"][0])
]

answer = generate_answer(query, top_chunks)
print("\n--- LLM Answer ---")
print(answer)