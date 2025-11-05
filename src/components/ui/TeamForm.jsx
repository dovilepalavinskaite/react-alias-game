export default function TeamForm({ team, labelIndex, onChangeName, onRemove, disableRemove }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-xl gap-3">
      <label className="text-gray-200 shrink-0">Komanda {labelIndex}</label>

      <input
        type="text"
        value={team.name}
        onChange={(e) => onChangeName(team.id, e.target.value)}
        className="flex-1 bg-transparent border-b border-rose-400 text-white focus:outline-none"
        maxLength={24}
        placeholder={`Komanda ${labelIndex}`}
      />

      <button
        type="button"
        onClick={onRemove}
        disabled={disableRemove}
        className={`px-3 py-1 rounded-md text-sm transition cursor-pointer
          ${disableRemove
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-rose-700 hover:bg-rose-800 text-white"}`}
        aria-label={`Pašalinti komandą ${labelIndex}`}
        title={disableRemove ? "Reikia bent 2 komandų" : "Pašalinti komandą"}
      >
        Šalinti
      </button>
    </div>
  );
}