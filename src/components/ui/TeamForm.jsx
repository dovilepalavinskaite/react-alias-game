export default function TeamForm({
  team,
  labelIndex,
  onChangeName,
  onRemove,
  disableRemove,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 py-3 bg-[#1b2033] rounded-xl border border-gray-700/60 shadow-sm">
      {/* Label */}
      <label
        htmlFor={`team-${team.id}`}
        className="text-gray-300 text-sm sm:text-base font-medium shrink-0"
      >
        Komanda {labelIndex}
      </label>

      {/* Input */}
      <input
        id={`team-${team.id}`}
        type="text"
        value={team.name}
        onChange={(e) => onChangeName(team.id, e.target.value)}
        className="flex-1 w-full sm:w-auto bg-transparent border-b border-rose-400/70 text-white text-center sm:text-left focus:outline-none focus:border-rose-500 transition placeholder-gray-500"
        maxLength={24}
        placeholder={`Komanda ${labelIndex}`}
        aria-label={`Komandos ${labelIndex} pavadinimas`}
      />

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={disableRemove}
        className={`w-full sm:w-auto px-3 py-1.5 rounded-md text-sm font-medium transition ${
          disableRemove
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-rose-700 hover:bg-rose-800 text-white active:scale-[0.98]"
        }`}
        aria-label={`Pašalinti komandą ${labelIndex}`}
        title={disableRemove ? "Reikia bent dviejų komandų" : "Pašalinti komandą"}
      >
        Šalinti
      </button>
    </div>
  );
}