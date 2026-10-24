// Props: { slots: (string|null)[4], onPlace(index, name), onRemove(index), onSubmit() }
// Drag a tile into a slot. Tap/Enter on a tile fills the first empty slot, tap/Enter on a filled slot removes it.
// Checking the order is not done here: read state.ritualSlots in onSubmit.

// Display order is scrambled on purpose so the pool never shows the answer.
const POOL = ["NAME", "BOW", "OFFER", "CLAP"];

export default function RitualPuzzle({ slots, onPlace, onRemove, onSubmit }) {
  const firstEmpty = slots.indexOf(null);

  const startDrag = (e, name) => {
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.effectAllowed = "move";
  };
  const drop = (e, i) => {
    e.preventDefault();
    const name = e.dataTransfer.getData("text/plain");
    if (POOL.includes(name)) onPlace(i, name);
  };
  const onKey = (e, fn) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
  };

  return (
    <div className="ritual">
      <div className="slots">
        {slots.map((s, i) => (
          <div
            key={i}
            className={"slot" + (s ? " full" : "")}
            role="button"
            tabIndex={0}
            draggable={Boolean(s)}
            aria-label={s ? `Slot ${i + 1}: ${s}. Press to remove.` : `Slot ${i + 1}: empty`}
            onDragStart={s ? (e) => startDrag(e, s) : undefined}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => drop(e, i)}
            onClick={() => s && onRemove(i)}
            onKeyDown={(e) => s && onKey(e, () => onRemove(i))}
          >
            {s || i + 1}
          </div>
        ))}
      </div>

      <div className="pool">
        {POOL.map((name) => {
          const used = slots.includes(name);
          const place = () => !used && firstEmpty !== -1 && onPlace(firstEmpty, name);
          return (
            <div
              key={name}
              className="tile"
              role="button"
              tabIndex={used ? -1 : 0}
              aria-disabled={used}
              draggable={!used}
              onDragStart={(e) => startDrag(e, name)}
              onClick={place}
              onKeyDown={(e) => onKey(e, place)}
            >
              {name}
            </div>
          );
        })}
      </div>

      <button className="primary" disabled={firstEmpty !== -1} onClick={onSubmit}>
        Perform the ritual
      </button>
    </div>
  );
}