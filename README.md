# Semantic Code Search

An AI-powered Semantic Code Search application that enables users to index GitHub repositories and ask natural language questions about the codebase using Retrieval-Augmented Generation (RAG).

---

## Features

- 🔍 Semantic code search using Sentence Transformers
- 🤖 AI-powered answers using Google Gemini
- 📂 GitHub repository indexing
- 🧠 ChromaDB vector database for semantic retrieval
- ⚡ Query caching for improved performance
- 📝 Query logging
- 👍 User feedback collection
- 📊 Automated evaluation framework
- 🔄 Smart re-indexing using SHA-256 change detection
- 🌐 REST API built with FastAPI
- 💻 Interactive React frontend

---

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Python
- FastAPI
- ChromaDB
- Sentence Transformers
- Google Gemini API
- GitPython

---

## Project Structure

```
semantic-code-search/
│
├── backend/
│   ├── app/
│   ├── evaluation/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/index` | Index a GitHub repository |
| POST | `/query` | Ask questions about the indexed repository |
| POST | `/feedback` | Save user feedback |

---

## Future Improvements

- User Authentication
- Multi-language code support
- True incremental vector updates
- Multi-repository search
- Enhanced evaluation metrics

---

## Author

**Himani**

B.Tech – Artificial Intelligence & Data Science