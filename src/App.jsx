import styles from "./index.module.css";
import { useState } from "react";

function App() {
  const [queryDescription, setQueryDescription] = useState("");
  const [sqlQueries, setSqlQueries] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const generated = await generateQuery();
    setSqlQueries((prevQueries) => [
      { text: generated, copied: false },
      ...prevQueries,
    ].slice(0, 4));
  };

  const generateQuery = async () => {
    const response = await fetch("https://sqltranslator-server.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryDescription }),
    });

    const data = await response.json();
    return data.sqlQuery.trim();
  };

  const copyToClipboard = async (query, index) => {
    await navigator.clipboard.writeText(query.text);
    
    setSqlQueries((prevQueries) =>
      prevQueries.map((q, i) =>
        i === index ? { ...q, copied: true } : q
      )
    );

    setTimeout(() => {
      setSqlQueries((prevQueries) =>
        prevQueries.map((q, i) =>
          i === index ? { ...q, copied: false } : q
        )
      );
    }, 1000);
  };

  const deleteQuery = (index) => {
    setSqlQueries((prevQueries) => prevQueries.filter((_, i) => i !== index));
  };

  return (
    <main className={styles.main}>
      <h3>Generate SQL with AI</h3>
      <div className={styles.instructionBox}>
        <p>
          This tool helps you generate SQL queries by simply describing what you want in natural language.
          Just type a description of your query and the AI will convert it into the appropriate SQL syntax for you.
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className={styles.wrapper}>
          <input
            className={styles.myinput}
            type="text"
            placeholder="Describe your query"
            onChange={(e) => setQueryDescription(e.target.value)}
          />
          <button className={styles.mybutton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                  viewBox="0 0 24 24" strokeWidth="2" stroke="#212121" fill="none" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l14 0"></path>
                  <path d="M13 18l6 -6"></path>
                  <path d="M13 6l6 6"></path>
            </svg>
          </button>
        </div>
      </form>
      <hr/>
      <div className={styles.queryList}>
        {sqlQueries.map((query, index) => (
          <div key={index} className={styles.queryContainer}>
            <pre>{query.text}</pre>
            <button
              className={`${styles.copyButton} ${query.copied ? styles.copied : ""}`}
              onClick={() => copyToClipboard(query, index)}
            >
              <span>Copy</span>
            </button>
            <button className={styles.deleteButton} onClick={() => deleteQuery(index)}>
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
