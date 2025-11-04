import { useState } from "react";
import "./App.css";
import Game from "./components/Game.jsx";
import Teams from "./components/Teams.jsx";

export default function App() {
  const [teams, setTeams] = useState([
    { id: 1, name: "Komanda 1" },
    { id: 2, name: "Komanda 2" },
  ]);

  function handleTeamsChange(nextTeams) {
    setTeams(nextTeams);
  }

  function handleStartGame() {
    console.log("Starting with teams:", teams);
  }

  return (
    <>
      <div className="flex flex-col items-center text-center py-24">
        <h1 className="text-4xl font-bold text-rose-500 mb-2">Žodžių mūšis</h1>
        <p className="text-lg text-gray-200">
          Atspėk kuo daugiau žodžių ir laimėk!
        </p>
      </div>

      <Teams
        teams={teams}
        onTeamsChange={handleTeamsChange}
        onStart={handleStartGame}
      />
      {/* <Game /> */}
    </>
  );
}