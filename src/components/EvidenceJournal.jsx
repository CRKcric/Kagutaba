// Props: { entries: { third: string, you: string }[], you: boolean }
// `you` flips every entry to second person.
export default function EvidenceJournal({ entries, you }) {
  return (
    <div className="journal">
      {entries.length === 0 && <p className="empty">Nothing recorded yet.</p>}
      {entries.map((e, i) => (
        <p key={i}>{you ? e.you : e.third}</p>
      ))}
    </div>
  );
}