import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indexed, setIndexed] = useState(false);

  const handleIndex = async () => {
  try {
    setLoading(true);

    await axios.post(`${API_URL}/index`, {
      repo_url: repoUrl,
    });

    setIndexed(true);
  } catch (err) {
    console.error(err);
    alert("Failed to index repository.");
  } finally {
    setLoading(false);
  }
};

  const handleQuery = async () => {
  try {
    setLoading(true);

    const res = await axios.post(`${API_URL}/query`, {
      question,
    });

    setAnswer(res.data.answer);
    setSources(res.data.sources);
  } catch (err) {
    console.error(err);
    alert("Something went wrong while asking the question.");
  } finally {
    setLoading(false);
  }
};

const sendFeedback = async (rating) => {
  try {
    await axios.post(`${API_URL}/feedback`, {
      question: question,
      answer: answer,
      rating: rating,
    });

    alert("Thank you for your feedback!");
  } catch (err) {
    console.error(err);
    alert("Failed to save feedback.");
  }
};

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "40px auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
     }}
    >
      <h1
        style={{
        textAlign: "center",
        color: "#2563eb",
        fontSize: "38px",
        marginBottom: "30px",
     }}
   >
        🔍 Semantic Code Search using RAG & Gemini
      </h1>

      <h3>1. Index a repo</h3>
      <input
        style={{
          width: "75%",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
        placeholder="https://github.com/user/repo.git"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={handleIndex} disabled={loading}
      style={{
        marginLeft: "10px",
        padding: "10px 18px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontSize: "15px",
        width: "110px",
        fontWeight: "bold",
      }}>Index</button>
      {indexed && <p>✅ Repo indexed!</p>}

      <h3>2. Ask a question</h3>
      <input
        style={{
          width: "75%",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
        placeholder="How is user login handled?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleQuery}
        disabled={loading || !indexed}
        style={{
          marginLeft: "10px",
          padding: "10px 18px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#16a34a",
          color: "white",
          cursor: "pointer",
          fontSize: "15px",
          width: "110px",
          fontWeight: "bold",
        }}
>
  Ask
</button>

      {loading && (
        <p style={{ color: "#2563eb", fontWeight: "bold" }}>
        🔄 Please wait...
      </p>
     )}

      {answer && (
  <div style={{ marginTop: 20 }}>
    <h3>Answer</h3>

    <p>{answer}</p>

    <div style={{ marginTop: 20 }}>
      <button
        onClick={() => sendFeedback(1)}
        style={{
          padding: "10px 18px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#22c55e",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        👍 Helpful
      </button>

      <button
        onClick={() => sendFeedback(0)}
        style={{
          marginLeft: 10,
          padding: "10px 18px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#ef4444",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        👎 Not Helpful
      </button>
    </div>

    <h4>Sources</h4>
          {sources.map((s, i) => (
            <pre key={i} style={{ background: "#f4f4f4", padding: 10 }}>
              {s.file} :: {s.name}{"\n"}{s.code.slice(0, 200)}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;