import { useEffect, useState } from "react";
import { loadPack } from "../data/loadPack";

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function Game() {
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    loadPack("/words/lt-basic.json").then((data) => {
      const shuffled = shuffle(data);
      setWords(shuffled);
    });
  }, []);

  if (!words.length) return <p>Kraunama...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>{words[current]}</h2>
      <button onClick={() => setCurrent((i) => (i + 1) % words.length)}>
        Kitas žodis
      </button>
    </div>
  );
}