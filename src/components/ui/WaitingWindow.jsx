import { useEffect, useState } from "react";

export default function WaitingWindow({ playingTeam, seconds = 5, onDone }) {
  const [left, setLeft] = useState(seconds);
  const showGo = left === 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (left === 0) {
      const timeout = setTimeout(() => onDone?.(), 800);
      return () => clearTimeout(timeout);
    }
  }, [left, onDone]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4">
      <h3 className="text-rose-400 text-xl sm:text-2xl font-semibold mb-2">
        Žaidžia komanda:
      </h3>
      <p className="text-rose-200 text-2xl sm:text-3xl font-bold mb-8 break-words max-w-[80%]">
        {playingTeam}
      </p>

      <div
        className={`text-6xl sm:text-8xl font-extrabold tracking-wider transition-all duration-300 ${
          showGo ? "text-emerald-400 scale-125" : "text-white"
        }`}
      >
        {showGo ? "Pirmyn!" : left}
      </div>

      {!showGo && (
        <div className="mt-8 w-64 sm:w-80 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(left / seconds) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}