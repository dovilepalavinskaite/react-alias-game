import { useEffect, useState } from "react";
import "./App.css";
import Game from "./components/Game.jsx";
import Teams from "./components/Teams.jsx";
import WaitingWindow from "./components/ui/WaitingWindow.jsx";
import Results from "./components/Results.jsx";

const DEFAULT_TEAMS = [
  { id: 1, name: "Komanda 1" },
  { id: 2, name: "Komanda 2" },
];

const VALID_PHASES = new Set(["setup", "waiting", "game", "results"]);

export default function App() {
  // --- Teams (persisted) ---
  const [teams, setTeams] = useState(() => {
    try {
      const raw = localStorage.getItem("alias:teams");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_TEAMS;
    } catch {
      return DEFAULT_TEAMS;
    }
  });

  // --- Phase (persisted) ---
  const [phase, setPhase] = useState(() => {
    try {
      const saved = localStorage.getItem("alias:phase");
      return VALID_PHASES.has(saved) ? saved : "setup";
    } catch {
      return "setup";
    }
  });

  useEffect(() => {
    localStorage.setItem("alias:phase", phase);
  }, [phase]);

  // --- Active team index (persisted) ---
  const [activeTeamIndex, setActiveTeamIndex] = useState(() => {
    try {
      const raw = localStorage.getItem("alias:activeIdx");
      const n = raw != null ? Number(raw) : 0;
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem("alias:activeIdx", String(activeTeamIndex));
  }, [activeTeamIndex]);

  const activeTeam = teams[activeTeamIndex];

  // --- Totals per team id (persisted) ---
  const [totals, setTotals] = useState(() => {
    try {
      const raw = localStorage.getItem("alias:totals");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("alias:totals", JSON.stringify(totals));
  }, [totals]);

  // --- Last round points (persisted) ---
  const [lastPoints, setLastPoints] = useState(() => {
    try {
      const raw = localStorage.getItem("alias:lastPoints");
      const n = raw != null ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem("alias:lastPoints", String(lastPoints));
  }, [lastPoints]);

  // Keep teams persisted
  useEffect(() => {
    localStorage.setItem("alias:teams", JSON.stringify(teams));
  }, [teams]);

  // Ensure totals has an entry for each team; drop removed teams. Clamp active index.
  useEffect(() => {
    setTotals((prev) => {
      const next = { ...prev };
      for (const t of teams) if (next[t.id] == null) next[t.id] = 0;
      Object.keys(next).forEach((k) => {
        if (!teams.some((t) => t.id === Number(k))) delete next[k];
      });
      return next;
    });
    setActiveTeamIndex((i) => Math.min(i, Math.max(teams.length - 1, 0)));
  }, [teams]);

  // --- Flow handlers ---
  function handleStartWaiting() {
    setPhase("waiting");
  }

  function handleWaitingDone() {
    setPhase("game");
  }

  function handleGameDone(points) {
    if (!activeTeam) return;
    setTotals((prev) => ({
      ...prev,
      [activeTeam.id]: (prev[activeTeam.id] ?? 0) + points,
    }));
    setLastPoints(points);
    setPhase("results");
  }

  function handleNextRound() {
    setActiveTeamIndex((i) => (teams.length ? (i + 1) % teams.length : 0));
    setPhase("waiting");
  }

  // Optional full reset
  function handleResetAll() {
    if (!window.confirm("Ar tikrai norite pradėti naują žaidimą?")) return;
    localStorage.removeItem("alias:teams");
    localStorage.removeItem("alias:totals");
    localStorage.removeItem("alias:activeIdx");
    localStorage.removeItem("alias:phase");
    localStorage.removeItem("alias:lastPoints");
    setTeams(DEFAULT_TEAMS);
    setTotals({});
    setActiveTeamIndex(0);
    setLastPoints(0);
    setPhase("setup");
  }

  // --- UI ---
  return (
    <>
      {phase === "setup" && (
        <Teams teams={teams} onTeamsChange={setTeams} onStart={handleStartWaiting} />
      )}

      {phase === "waiting" && (
        <WaitingWindow
          playingTeam={activeTeam?.name ?? "Komanda"}
          seconds={5}
          onDone={handleWaitingDone}
        />
      )}

      {phase === "game" && (
        <Game
          teams={teams}
          activeTeamIndex={activeTeamIndex}
          onDone={handleGameDone} // Game should call onDone(points)
        />
      )}

      {phase === "results" && (
        <Results
          team={activeTeam}
          roundPoints={lastPoints}
          totalPoints={totals[activeTeam?.id] ?? 0}
          onNextRound={handleNextRound}
          allTotals={totals}
          teams={teams}
          onReset={handleResetAll}
        />
      )}
    </>
  );
}