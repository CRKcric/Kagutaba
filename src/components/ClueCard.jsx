import { useEffect, useState } from "react";
import { ASSETS, blendStyle } from "../data/assets";

// Props: { clue, text, locationName, wet?: boolean, onClose: () => void }
// `wet` adds the hair and starts the slow stain. The text underneath is never covered.
export default function ClueCard({ clue, text, locationName, wet = false, onClose }) {
  const [damp, setDamp] = useState(false);

  // Switch the class on after mount so the 9s stain transition actually plays.
  useEffect(() => {
    if (!wet) return;
    const t = setTimeout(() => setDamp(true), 50);
    return () => clearTimeout(t);
  }, [wet]);

  return (
    <article className={"card" + (damp ? " wet" : "")}>
      <h3>{clue.source || clue.label}</h3>
      <small>{locationName}</small>
      <p>{text}</p>
      <button className="primary" onClick={onClose}>Close</button>
      <img className="hair" src={ASSETS.hair.src} style={blendStyle(ASSETS.hair)} alt="" aria-hidden="true" draggable="false" />
      <img className="stain" src={ASSETS.stain.src} style={blendStyle(ASSETS.stain)} alt="" aria-hidden="true" draggable="false" />
    </article>
  );
}