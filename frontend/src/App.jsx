import { useState } from "react";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import "./App.css";

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
        question,
        answer,
        rating,
      });

      alert("Thank you for your feedback!");
    } catch (err) {
      console.error(err);
      alert("Failed to save feedback.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        <FaGithub className="github-icon" />
        Semantic Code Search
      </h1>

      <p className="subtitle">
        Search and understand any GitHub repository using <strong>RAG + Gemini</strong>
      </p>

      <div className="section">
        <h3>📂 Index Repository</h3>

        <input
          className="input"
          type="text"
          placeholder="https://github.com/user/repository.git"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />

        <button
          className="button"
          onClick={handleIndex}
          disabled={loading}
        >
          {loading ? "Indexing..." : "Index Repository"}
        </button>

        {indexed && (
          <p className="success">
            ✅ Repository indexed successfully
          </p>
        )}
      </div>

      <div className="section">
        <h3>💬 Ask AI</h3>

        <input
          className="input"
          type="text"
          placeholder="Example: How does authentication work?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          className="button"
          onClick={handleQuery}
          disabled={!indexed || loading}
        >
          {loading ? "Thinking..." : "Ask Question"}
        </button>
      </div>

      {loading && (
        <p className="loading">
          ⏳ Processing your request...
        </p>
      )}

      {answer && (
        <div className="answer-box">
          <h3>🤖 AI Response</h3>

          <p>{answer}</p>

          <div className="feedback">
            <button
              className="button"
              onClick={() => sendFeedback(1)}
            >
              👍 Helpful
            </button>

            <button
              className="button"
              style={{ background: "#da3633", marginLeft: "10px" }}
              onClick={() => sendFeedback(0)}
            >
              👎 Not Helpful
            </button>
          </div>

          <h3 style={{ marginTop: "30px" }}>📄 Source Files</h3>

          {sources.map((s, i) => (
            <div key={i} className="source-card">
              <strong>{s.file}</strong>

              <br />

              <span>{s.name}</span>

              <pre
                style={{
                  marginTop: "10px",
                  whiteSpace: "pre-wrap",
                  overflowX: "auto",
                }}
              >
{s.code.slice(0, 200)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;