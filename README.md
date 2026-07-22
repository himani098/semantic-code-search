# Semantic Code Search

An AI-powered Semantic Code Search application that allows users to index GitHub repositories and ask natural language questions about the codebase.

## Features

- Semantic code search using Sentence Transformers
- FastAPI backend
- React frontend
- ChromaDB vector database
- Google Gemini integration
- Repository indexing
- Smart re-indexing using SHA-256 hash comparison
- Query caching
- Query logging
- User feedback collection
- Evaluation framework

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- FastAPI
- Python
- ChromaDB
- Sentence Transformers
- GitPython
- Google Gemini API

## Project Structure

```
semantic-code-search/
│
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

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

## Future Improvements

- Authentication
- Docker
- Cloud Deployment
- Dashboard
- Better evaluation metrics