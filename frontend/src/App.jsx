import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

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
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>🔍 Semantic Code Search</h1>

      <h3>1. Index a repo</h3>
      <input
        style={{ width: "70%" }}
        placeholder="https://github.com/user/repo.git"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={handleIndex} disabled={loading}>Index</button>
      {indexed && <p>✅ Repo indexed!</p>}

      <h3>2. Ask a question</h3>
      <input
        style={{ width: "70%" }}
        placeholder="How is user login handled?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleQuery} disabled={loading || !indexed}>
  Ask
</button>

      {loading && <p>Loading...</p>}

      {answer && (
  <div style={{ marginTop: 20 }}>
    <h3>Answer</h3>

    <p>{answer}</p>

    <div style={{ marginTop: 20 }}>
      <button onClick={() => sendFeedback(1)}>
        👍 Helpful
      </button>

      <button
        onClick={() => sendFeedback(0)}
        style={{ marginLeft: 10 }}
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