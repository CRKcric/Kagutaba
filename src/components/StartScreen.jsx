import { useState } from "react";
import { START_CREDIT } from "../data/credits";

// Put the title image at public/images/title.png. If it is missing, the text title shows instead.
const TITLE = `${import.meta.env.BASE_URL}images/title.png`;

// Props: { gentleMode, onToggleGentle(), onStart() }
export default function StartScreen({ onStart }) {
  const [noTitle, setNoTitle] = useState(false);
  return (
    <section className="start vhs-fx">
      {noTitle ? (
        <h1>KAGUTABA</h1>
      ) : (
        <h1 className="title-img">
          <img src={TITLE} alt="Kagutaba" onError={() => setNoTitle(true)} />
        </h1>
      )}
      <p className="tagline">The Last Recording</p>
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