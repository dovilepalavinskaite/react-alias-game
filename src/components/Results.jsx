import React, { useMemo } from "react";

export default function Results({
  team,
  roundPoints,
  totalPoints,
  onNextRound,
  teams,
  allTotals,
  onReset,
  winningPoints,
}) {
  const isWinner = totalPoints >= winningPoints;

  // Progress toward win:
  const progressPct = useMemo(() => {
    const pct = (totalPoints / winningPoints) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }, [totalPoints, winningPoints]);

  // Scoreboard sorted desc by total:
  const sortedBoard = useMemo(() => {
    if (!teams || !allTotals) return [];
    return [...teams]
      .map((t) => ({ ...t, total: allTotals[t.id] ?? 0 }))
      .sort((a, b) => b.total - a.total);
  }, [teams, allTotals]);

  return (
    <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl text-rose-400 mb-2">Rezultatai</h2>
      <p className="text-sm text-gray-300 mb-6">
        Laimi pasiekus <span className="font-semibold text-rose-300">{winningPoints}</span> taškų
      </p>

      {isWinner && (
        <div
          className="mb-6 rounded-xl border border-rose-500/40 bg-rose-900/30 p-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-3xl sm:text-4xl font-extrabold text-rose-300">
            🏆 <span className="text-rose-500">{team?.name}</span> laimėjo!
          </p>
        </div>
      )}

      {/* Round & total */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 text-left sm:text-center">
        <div className="rounded-lg bg-[#1b2033] border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Komanda</p>
          <p className="text-lg font-semibold">{team?.name}</p>
        </div>
        <div className="rounded-lg bg-[#1b2033] border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Taškai šiame raunde</p>
          <p className="text-lg font-semibold">{roundPoints}</p>
        </div>
        <div className="rounded-lg bg-[#1b2033] border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Iš viso</p>
          <p className="text-lg font-semibold">
            {totalPoints} <span className="text-gray-400">/ {winningPoints}</span>
          </p>
        </div>
      </div>

      {/* Progress toward goal */}
      <div className="mb-8 text-left sm:text-center">
        <div className="h-3 w-full rounded-full bg-gray-700 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isWinner ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${progressPct}%` }}
            aria-valuemin={0}
            aria-valuemax={winningPoints}
            aria-valuenow={totalPoints}
            role="progressbar"
          />
        </div>
        <p className="mt-2 text-sm text-gray-300">{progressPct}% iki tikslo</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
        <button
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 transition"
          onClick={onReset}
        >
          Žaisti iš naujo
        </button>

        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg transition ${
            isWinner
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
          onClick={onNextRound}
          disabled={isWinner}
        >
          Tęsti
        </button>
      </div>

      {/* Scoreboard */}
      {sortedBoard.length > 0 && (
        <div className="mt-10 text-left">
          <h3 className="text-lg sm:text-xl mb-3">Bendras rezultatas</h3>
          <ul className="divide-y divide-rose-400/40 border-t border-b border-rose-400/40">
            {sortedBoard.map((t, i) => {
              const isActive = t.id === team?.id;
              return (
                <li
                  key={t.id}
                  className={`flex items-center justify-between py-3 sm:py-4 ${
                    isActive ? "bg-rose-900/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-gray-400 tabular-nums">{i + 1}.</span>
                    <span className={`${
                      isActive ? "font-semibold text-rose-300" : "text-white"
                    }`}>
                      {t.name}
                    </span>
                  </div>
                  <span className="tabular-nums">{t.total}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}