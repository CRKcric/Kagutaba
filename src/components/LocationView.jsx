import { useState } from "react";
import { CLUES, getClueText } from "../data/clues";
import { SceneBackground } from "./art";
import GhostFigure from "./GhostFigure";
import ClueCard from "./ClueCard";

// Props: { location, visits, onDiscover(clueId), onCloseClue(clueId), onBack() }
export default function LocationView({ location, visits, onDiscover, onCloseClue, onBack }) {
  const [openId, setOpenId] = useState(null);

  const open = (id) => { setOpenId(id); onDiscover(id); };
  const close = () => { onCloseClue?.(openId); setOpenId(null); };

  const clue = openId ? CLUES[openId] : null;

  return (
    <section className="location">
      <h2>{location.name}</h2>

      <figure className="scene vhs-fx" data-loc={location.id}>
        <SceneBackground id={location.id} />
        <GhostFigure visits={visits[location.id]} />
      </figure>
      <p className="hint">{location.blurb}</p>

      {clue ? (
        <ClueCard
          clue={clue}
          text={getClueText(clue, visits)}
          locationName={location.name}
          wet={clue.id === "E2"}
          onClose={close}
        />
      ) : (
        <>
          <ul className="clues">
            {location.clueIds.map((id) => (
              <li key={id}>
                <button className="clue-btn" onClick={() => open(id)}>{CLUES[id].label}</button>
              </li>
            ))}
          </ul>
          <button className="back" onClick={onBack}>Back to the village</button>
        </>
      )}
    </section>
  );
}