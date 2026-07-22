import chromadb

client = chromadb.PersistentClient(path="./chroma_db")

COLLECTION_NAME = "code_chunks"

try:
    client.delete_collection(COLLECTION_NAME)
except Exception:
    pass

collection = client.get_or_create_collection(name=COLLECTION_NAME)


def clear_collection():
    global collection
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.get_or_create_collection(name=COLLECTION_NAME)


def add_chunks(chunks, embeddings):
    ids = [
        f"{c['file']}::{c['name']}::{c['start_line']}"
        for c in chunks
    ]

    documents = [c["code"] for c in chunks]

    metadatas = [
        {
            "file": c["file"],
            "name": c["name"],
            "type": c["type"],
            "start_line": c["start_line"],
        }
        for c in chunks
    ]

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )


def search(query_embedding, top_k=10):
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )