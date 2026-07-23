from sentence_transformers import SentenceTransformer

model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model

def embed_text(text: str):
    return get_model().encode(text).tolist()

def embed_batch(texts: list[str]):
    return get_model().encode(texts).tolist()