import { useEffect, useRef, useState } from "react";
import { loadPack } from "../data/loadPack";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Game({
  onDone,
  duration = 3,                       // ← use 60 in production (set to 3 while testing)
  packUrl = "/words/lt-basic.json",
}) {
  const [words, setWords] = useState([]);
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);

  // Load & shuffle
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await loadPack(packUrl);
      if (!alive) return;
      setWords(shuffle(data));
      setIdx(0);
    })();
    return () => { alive = false; };
  }, [packUrl]);

  // Deadline-based countdown
  const deadlineRef = useRef(null);
  useEffect(() => {
    deadlineRef.current = Date.now() + duration * 1000;
    setTimeLeft(duration);

    const t = setInterval(() => {
      const leftMs = Math.max(0, deadlineRef.current - Date.now());
      const next = Math.ceil(leftMs / 1000);
      setTimeLeft(next);
      if (next === 0) {
        clearInterval(t);
      }
    }, 200);

    return () => clearInterval(t);
  }, [duration]);

  // When time ends, pass the points
  useEffect(() => {
    if (timeLeft !== 0) return;
    const to = setTimeout(() => onDone?.(points), 600);
    return () => clearTimeout(to);
  }, [timeLeft, points, onDone]);

  if (words.length === 0) return <p>Kraunama...</p>;

  function nextWord() {
    if (idx + 1 >= words.length) {
      const reshuffled = shuffle(words);
      setWords(reshuffled);
      setIdx(0);
    } else {
      setIdx((i) => i + 1);
    }
  }

  function handleCorrect() {
    if (timeLeft === 0) return;
    setPoints((p) => p + 1);
    nextWord();
  }

  function handleSkip() {
    if (timeLeft === 0) return;
    setPoints((p) => p - 1);
    nextWord();
  }

  const isOver = timeLeft === 0;

  return (
    <div className="flex flex-col items-center justify-center text-center mt-16">
      <div className="text-xl font-extrabold tracking-wider mb-2">
        <p>
          Laikas: <span className="text-rose-600 font-bold">{timeLeft}</span> s
        </p>
      </div>

      <h1 className="text-6xl mb-16 min-h-[100px] flex items-center justify-center">
        {words[idx]}
      </h1>

      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={handleSkip}
          disabled={isOver}
          className={`px-8 py-3 rounded-lg text-white font-semibold ${
            isOver ? "bg-red-900/60 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
          }`}
          aria-disabled={isOver}
        >
          Kitas
        </button>

        <button
          onClick={handleCorrect}
          disabled={isOver}
          className={`px-8 py-3 rounded-lg text-white font-semibold ${
            isOver ? "bg-green-900/60 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
          }`}
          aria-disabled={isOver}
        >
          TAIP!
        </button>
      </div>

      <p className="text-lg text-gray-200">Surinkti taškai: {points}</p>
    </div>
  );
}