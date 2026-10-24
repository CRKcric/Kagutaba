import { START_CREDIT } from "../data/credits";
// Props: { gentleMode, onToggleGentle(), onStart() }
export default function StartScreen({ onStart }) {
  return (
    <section className="start vhs-fx">
      <h1>KAGUTABA</h1>
      <p>A journalist has vanished. His tapes survived. Watch them, find the ritual, and end the curse.</p>
      <div className="warn" role="note">
        Trigger warning: horror and jumpscares.
      </div>
      <div>
        <button className="go" type="button" onClick={onStart}>Begin the tapes</button>
      </div>
      <p className="credit">{START_CREDIT}</p>
    </section>
  );
}