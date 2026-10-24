// Props: { gentleMode, onToggleGentle(), onStart() }
export default function StartScreen({ gentleMode, onToggleGentle, onStart }) {
  return (
    <section className="start vhs-fx">
      <h1>KAGUTABA</h1>
      <p>A journalist has vanished. His tapes survived. Watch them, find the ritual, and end the curse.</p>
      <div className="warn" role="note">
        This game contains sudden loud sounds and frightening imagery.
      </div>
      <label className="tog">
        <input type="checkbox" checked={gentleMode} onChange={onToggleGentle} />
        Gentle mode: slow fades instead of sudden scares
      </label>
      <div>
        <button className="go" type="button" onClick={onStart}>Begin the tapes</button>
      </div>
      <p className="credit">Inspired by Noroi: The Curse (2005), directed by Kōji Shiraishi. All art, text and sound here are original.</p>
    </section>
  );
}