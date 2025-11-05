import TeamForm from "./ui/TeamForm";
import GameLogo from "../assets/game-logo.png";

export default function GameSetup({
  teams,
  onTeamsChange,
  onStart,
  onThemeSelect,
  currentTheme,
  winningPoints,
  onWinPointsSelect,
}) {
  const canAddMore = teams.length < 5;
  const canRemove = teams.length > 2;

  const handleAddTeam = () => {
    if (!canAddMore) return;
    const newId = teams.length ? Math.max(...teams.map((t) => t.id)) + 1 : 1;
    onTeamsChange([...teams, { id: newId, name: `Komanda ${newId}` }]);
  };

  const handleNameChange = (id, name) => {
    onTeamsChange(teams.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const handleRemoveTeam = (id) => {
    if (!canRemove) return;
    onTeamsChange(teams.filter((t) => t.id !== id));
  };

  const handleGameStart = () => {
    const valid = teams.filter((t) => t.name.trim() !== "");
    if (valid.length < 2) {
      alert("Reikia bent dviejų įvestų komandų pavadinimų.");
      return;
    }
    if (!currentTheme) {
      alert("Pasirinkite žaidimo temą!");
      return;
    }
    if (!winningPoints) {
      alert("Pasirinkite taškų skaičių laimėjimui!");
      return;
    }
    onStart?.();
  };

  return (
    <div className="flex flex-col items-center text-center gap-4 px-4 sm:px-6 pb-12">
      {/* Header */}
      <header className="flex flex-col items-center py-10">
        <img
          src={GameLogo}
          alt="Game logo"
          className="w-32 h-32 sm:w-40 sm:h-40 mb-3"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-rose-500 mb-1">
          Žodžių mūšis
        </h1>
        <p className="text-base sm:text-lg text-gray-200 max-w-xs sm:max-w-none">
          Atspėk kuo daugiau žodžių ir laimėk!
        </p>
      </header>

      {/* Theme Selection */}
      <section className="my-6 sm:my-8">
        <h3 className="text-lg sm:text-xl font-semibold text-rose-400 mb-3 sm:mb-4">
          Pasirinkite žaidimo temą:
        </h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            { label: "🧸 Vaikiškas", value: "basic" },
            { label: "💀 Sunkus", value: "hard" },
            { label: "🌟 Įžymybės", value: "celebrities" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onThemeSelect(option.value)}
              className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                currentTheme === option.value
                  ? "bg-rose-600 text-white"
                  : "bg-gray-700 text-gray-100 hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* Winning Points Selection */}
      <section className="my-6 sm:my-8">
        <h3 className="text-lg sm:text-xl font-semibold text-rose-400 mb-3 sm:mb-4">
          Pasirinkite taškų skaičių laimėjimui:
        </h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[30, 50, 75, 100, 150, 200].map((points) => (
            <button
              key={points}
              onClick={() => onWinPointsSelect(points)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold transition text-sm sm:text-base ${
                winningPoints === points
                  ? "bg-rose-600 text-white"
                  : "bg-gray-700 text-gray-100 hover:bg-gray-600"
              }`}
            >
              {points}
            </button>
          ))}
        </div>
      </section>

      {/* Teams */}
      <section className="w-full max-w-md">
        <h3 className="text-lg sm:text-xl font-semibold text-rose-400 mb-3 sm:mb-4">
          Komandos:
        </h3>
        <div className="flex flex-col gap-3 sm:gap-4">
          {teams.map((team, idx) => (
            <TeamForm
              key={team.id}
              team={team}
              labelIndex={idx + 1}
              onChangeName={handleNameChange}
              onRemove={() => handleRemoveTeam(team.id)}
              disableRemove={!canRemove}
            />
          ))}
        </div>

        {/* Add team button */}
        <button
          onClick={handleAddTeam}
          disabled={!canAddMore}
          className={`mt-3 sm:mt-4 px-4 py-2 font-medium transition cursor-pointer w-full sm:w-auto ${
            canAddMore
              ? "text-rose-500 hover:text-rose-400"
              : "text-gray-600 cursor-not-allowed"
          }`}
        >
          + Pridėti komandą
        </button>
      </section>

      {/* Start game */}
      <button
        className="mt-8 px-6 py-3 rounded-lg transition cursor-pointer bg-rose-500 hover:bg-rose-600 text-white font-semibold w-full sm:w-auto"
        onClick={handleGameStart}
      >
        Pradėti žaidimą!
      </button>
    </div>
  );
}