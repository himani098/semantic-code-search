from sentence_transformers import SentenceTransformer

# loads once, reused everywhere
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str):
    """Convert a piece of text into a vector (list of numbers)."""
    return model.encode(text).tolist()

def embed_batch(texts: list[str]):
    """Embed many texts at once (faster than one by one)."""
    return model.encode(texts).tolist()