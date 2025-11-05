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

const DECK_KEY = "alias:deck";
const DECK_IDX_KEY = "alias:deckIdx";
const LAST_WORD_KEY = "alias:lastWord";

function reshuffleAvoidingRepeat(source, last) {
  const next = shuffle(source);
  if (last && next.length > 1 && next[0] === last) {
    const j = Math.floor(Math.random() * (next.length - 1)) + 1;
    [next[0], next[j]] = [next[j], next[0]];
  }
  return next;
}

export default function Game({ onDone, duration = 60, packUrl }) {
  const [deck, setDeck] = useState(() => {
    try {
      const raw = localStorage.getItem(DECK_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [idx, setIdx] = useState(() => {
    const raw = localStorage.getItem(DECK_IDX_KEY);
    const n = raw != null ? Number(raw) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  });

  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);

  const allWordsRef = useRef([]);
  const lastWordRef = useRef(null);
  const deadlineRef = useRef(null);

  // Load and initialize
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await loadPack(packUrl);
      if (!alive) return;

      allWordsRef.current = data;

      if (!deck.length) {
        const first = reshuffleAvoidingRepeat(data, lastWordRef.current);
        setDeck(first);
        setIdx(0);
        localStorage.setItem(DECK_KEY, JSON.stringify(first));
        localStorage.setItem(DECK_IDX_KEY, "0");
      }
    })();
    return () => {
      alive = false;
    };
  }, [packUrl]); // Only reload when pack changes

  // Load last shown word:
  useEffect(() => {
    try {
      const last = localStorage.getItem(LAST_WORD_KEY);
      if (last) lastWordRef.current = last;
    } catch {}
  }, []);

  // Persist deck/index changes
  useEffect(() => {
    localStorage.setItem(DECK_KEY, JSON.stringify(deck));
  }, [deck]);

  useEffect(() => {
    localStorage.setItem(DECK_IDX_KEY, String(idx));
  }, [idx]);

  // Timer
  useEffect(() => {
    deadlineRef.current = Date.now() + duration * 1000;
    setTimeLeft(duration);

    const interval = setInterval(() => {
      const remaining = Math.ceil((deadlineRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [duration]);

  // End round when timer hits 0
  useEffect(() => {
    if (timeLeft !== 0) return;

    // Save last word before round ends
    try {
      const currentWord = deck[idx];
      if (currentWord) {
        lastWordRef.current = currentWord;
        localStorage.setItem(LAST_WORD_KEY, currentWord);
      }
    } catch {}

    const timeout = setTimeout(() => onDone?.(points), 400);
    return () => clearTimeout(timeout);
  }, [timeLeft, deck, idx, points, onDone]);

  // Helpers:
  const currentWord = deck[idx];

  function startNewDeck() {
    const source = allWordsRef.current.length ? allWordsRef.current : deck;
    const next = reshuffleAvoidingRepeat(source, lastWordRef.current);
    setDeck(next);
    setIdx(0);
    localStorage.setItem(DECK_KEY, JSON.stringify(next));
    localStorage.setItem(DECK_IDX_KEY, "0");
  }

  function consumeWord() {
    lastWordRef.current = currentWord;
    localStorage.setItem(LAST_WORD_KEY, String(currentWord ?? ""));

    if (idx + 1 >= deck.length) {
      startNewDeck();
    } else {
      setIdx((i) => i + 1);
    }
  }

  const handleCorrect = () => {
    if (timeLeft === 0) return;
    setPoints((p) => p + 1);
    consumeWord();
  };

  const handleSkip = () => {
    if (timeLeft === 0) return;
    setPoints((p) => p - 1);
    consumeWord();
  };

  const isOver = timeLeft === 0;

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10 sm:py-16">
      <div className="text-lg sm:text-xl font-extrabold tracking-wider mb-3">
        <p>
          Laikas:{" "}
          <span className="text-rose-600 font-bold text-2xl">{timeLeft}</span> s
        </p>
      </div>

      <h1 className="text-4xl sm:text-6xl my-12 sm:my-16 min-h-[100px] flex items-center justify-center leading-tight">
        {currentWord ?? "Kraunama..."}
      </h1>

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 w-full sm:w-auto">
        <button
          onClick={handleSkip}
          disabled={isOver}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
            isOver
              ? "bg-red-900/60 cursor-not-allowed"
              : "bg-red-700 hover:bg-red-800 active:scale-[0.98]"
          }`}
        >
          Kitas
        </button>

        <button
          onClick={handleCorrect}
          disabled={isOver}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
            isOver
              ? "bg-green-900/60 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 active:scale-[0.98]"
          }`}
        >
          TAIP!
        </button>
      </div>

      <p className="text-lg text-gray-200">
        Surinkti taškai:{" "}
        <span className="font-semibold text-rose-400">{points}</span>
      </p>
    </div>
  );
}