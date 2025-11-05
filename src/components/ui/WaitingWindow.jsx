import { useEffect, useState } from "react";

export default function WaitingWindow({ playingTeam, seconds = 5, onDone }) {
  const [left, setLeft] = useState(seconds);
  const showGo = left === 0;

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (left === 0) {
      const timeout = setTimeout(() => onDone?.(), 800);
      return () => clearTimeout(timeout);
    }
  }, [left, onDone]);

  return (
    <div className="flex flex-col items-center text-center py-16">
      <h3 className="text-rose-500 text-2xl pb-3">Žaidžia komanda:</h3>
      <p className="text-rose-200 text-xl mb-6">{playingTeam}</p>

      <div className="text-5xl font-extrabold text-white tracking-wider">
        {showGo ? "Pirmyn!" : left}
      </div>
    </div>
  );
}