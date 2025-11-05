import TeamForm from "./ui/TeamForm";

export default function Teams({ teams, onTeamsChange, onStart }) {
  const canAddMore = teams.length < 5;
  const canRemove = teams.length > 2;

  function handleAddTeam() {
    if (!canAddMore) return;
    const newId = teams.length ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    onTeamsChange([...teams, { id: newId, name: `Komanda ${newId}` }]);
  }

  function handleNameChange(id, name) {
    onTeamsChange(teams.map(t => (t.id === id ? { ...t, name } : t)));
  }

  function handleRemoveTeam(id) {
    if (!canRemove) return;
    onTeamsChange(teams.filter(t => t.id !== id));
  }

  function handleGameStart() {
    const valid = teams.filter(t => t.name.trim() !== "");
    if (valid.length < 2) {
      alert("Reikia bent dviejų įvestų komandų pavadinimų.");
      return;
    }
    onStart?.();
  }

  return (
    <div className="flex flex-col items-center text-center gap-4">
        <div className="flex flex-col items-center text-center py-12">
            <h1 className="text-4xl font-bold text-rose-500 mb-2">Žodžių mūšis</h1>
            <p className="text-lg text-gray-200">
                Atspėk kuo daugiau žodžių ir laimėk!
            </p>
        </div>
      <h3 className="text-xl font-semibold text-rose-400">Komandos:</h3>

      <div className="flex flex-col gap-3 w-full max-w-md">
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

      <button
        onClick={handleAddTeam}
        disabled={!canAddMore}
        className={`mt-2 px-4 py-2 font-medium transition cursor-pointer
          ${canAddMore ? "text-rose-500" : "text-gray-600 cursor-not-allowed"}`}
      >
        + Pridėti komandą
      </button>

      <button
        className="px-4 py-2 rounded-lg transition cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
        onClick={handleGameStart}
      >
        Pradėti žaidimą!
      </button>
    </div>
  );
}