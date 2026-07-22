from app.chunker import chunk_repo, get_python_files
from app.file_hash import load_hashes, save_hashes, calculate_hash
from app.embedder import embed_batch
from app.vector_store import add_chunks, clear_collection

import git
import shutil
import tempfile


def repository_changed(repo_path):
    old_hashes = load_hashes()
    new_hashes = {}

    changed = False

    files = get_python_files(repo_path)

    for file in files:
        current_hash = calculate_hash(file)
        import os

        relative_path = os.path.relpath(file, repo_path)

        new_hashes[relative_path] = current_hash

        if old_hashes.get(relative_path) != current_hash:
            changed = True

    return changed, new_hashes


def index_repo(repo_url: str):
    clone_path = tempfile.mkdtemp(prefix="repo_")

    try:
        print("STEP 1: Cloning repository...")
        git.Repo.clone_from(repo_url, clone_path)
        print("✅ STEP 1 DONE")

        changed, new_hashes = repository_changed(clone_path)

        # Skip indexing if nothing changed
        if not changed:
            print("✅ Repository unchanged. Skipping indexing.")

            return {
                "status": "success",
                "message": "Repository already indexed. No changes detected."
            }

        print("STEP 2: Chunking...")
        chunks = chunk_repo(clone_path)
        print(f"✅ STEP 2 DONE - {len(chunks)} chunks")

        if not chunks:
            return {
                "status": "error",
                "message": "No Python chunks found"
            }

        print("STEP 3: Embedding...")
        texts = [c["code"] for c in chunks]
        embeddings = embed_batch(texts)
        print("✅ STEP 3 DONE")

        print("STEP 4: Writing to ChromaDB...")
        clear_collection()
        add_chunks(chunks, embeddings)

        save_hashes(new_hashes)

        print("✅ STEP 4 DONE")

        return {
            "status": "success",
            "chunks_indexed": len(chunks)
        }

    finally:
        shutil.rmtree(clone_path, ignore_errors=True)