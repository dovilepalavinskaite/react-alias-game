export default function Results({
  team,
  roundPoints,
  totalPoints,
  onNextRound,
  teams,       
  allTotals,
  onReset      
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl text-rose-400 mb-4">Rezultatai</h2>
      <p className="text-lg">Komanda: <strong>{team?.name}</strong></p>
      <p className="text-xl mt-2">Taškai šiame raunde: <strong>{roundPoints}</strong></p>
      <p className="text-lg mt-1">Iš viso: <strong>{totalPoints}</strong></p>

      <div className="flex justify-between gap-4 mt-6">
        <button 
            className="px-4 py-2 rounded bg-rose-700"
            onClick={onReset}
        >
            Nebežaisti
        </button>
        <button 
            className="px-4 py-2 rounded bg-green-700" 
            onClick={onNextRound}
        >
          Tęsti
        </button>
      </div>

      {teams && allTotals && (
        <div className="mt-8">
          <h3 className="text-lg mb-2">Bendras rezultatas</h3>
          <ul className="inline-block text-left">
            {teams.map(t => (
              <li key={t.id} 
                className="flex justify-between gap-8 flex-1 bg-transparent border-b border-rose-400 text-white focus:outline-none my-4">
                    <span>{t.name}</span>
                    <span>{allTotals[t.id] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}