import { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import Game from "./components/Game.jsx";
import GameSetup from "./components/GameSetup.jsx";
import WaitingWindow from "./components/ui/WaitingWindow.jsx";
import Results from "./components/Results.jsx";
import ResetModal from "./components/ui/ResetModal.jsx";

const DEFAULT_TEAMS = [
  { id: 1, name: "Komanda 1" },
  { id: 2, name: "Komanda 2" },
];

export default function App() {
  /** State Initialization **/
  const [teams, setTeams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("alias:teams")) || DEFAULT_TEAMS;
    } catch {
      return DEFAULT_TEAMS;
    }
  });

  const [phase, setPhase] = useState("setup");
  const [selectedTheme, setSelectedTheme] = useState("basic");
  const [winningPoints, setWinningPoints] = useState(100);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [totals, setTotals] = useState({});
  const [lastPoints, setLastPoints] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);

  const activeTeam = useMemo(() => teams[activeTeamIndex], [teams, activeTeamIndex]);

  useEffect(() => {
    localStorage.setItem("alias:teams", JSON.stringify(teams));
  }, [teams]);

  /** Phase Handlers **/
  const handleStartWaiting = useCallback(() => setPhase("waiting"), []);
  const handleWaitingDone = useCallback(() => setPhase("game"), []);
  const handleNextRound = useCallback(() => {
    setActiveTeamIndex((i) => (teams.length ? (i + 1) % teams.length : 0));
    setPhase("waiting");
  }, [teams.length]);

  const handleGameDone = useCallback(
    (points) => {
      setTotals((prev) => ({
        ...prev,
        [activeTeam.id]: (prev[activeTeam.id] ?? 0) + points,
      }));
      setLastPoints(points);
      setPhase("results");
    },
    [activeTeam]
  );

  /** Reset **/
  const performFullReset = useCallback(() => {
    localStorage.clear();
    setTeams(DEFAULT_TEAMS);
    setTotals({});
    setActiveTeamIndex(0);
    setLastPoints(0);
    setPhase("setup");
    setSelectedTheme("basic");
    setWinningPoints(100);
    setResetOpen(false);
  }, []);

  /** Determine pack URL **/
  const packUrl = useMemo(() => {
    switch (selectedTheme) {
      case "hard":
        return "/words/lt-hard.json";
      case "celebrities":
        return "/words/lt-famous.json";
      default:
        return "/words/lt-basic.json";
    }
  }, [selectedTheme]);

  return (
    <>
      {phase === "setup" && (
        <GameSetup
          teams={teams}
          onTeamsChange={setTeams}
          onStart={handleStartWaiting}
          onThemeSelect={setSelectedTheme}
          currentTheme={selectedTheme}
          winningPoints={winningPoints}
          onWinPointsSelect={setWinningPoints}
        />
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
          onDone={handleGameDone}
          packUrl={packUrl}
        />
      )}

      {phase === "results" && (
        <Results
          team={activeTeam}
          roundPoints={lastPoints}
          totalPoints={totals[activeTeam?.id] ?? 0}
          allTotals={totals}
          teams={teams}
          winningPoints={winningPoints}
          onNextRound={handleNextRound}
          onReset={() => setResetOpen(true)}
        />
      )}

      <ResetModal
        open={resetOpen}
        onConfirm={performFullReset}
        onCancel={() => setResetOpen(false)}
      />
    </>
  );
}