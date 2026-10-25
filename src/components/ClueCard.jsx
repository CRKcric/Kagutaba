import { useEffect, useState } from "react";
import { ASSETS, blendStyle } from "../data/assets";
import { VO_CUES } from "../data/voCues";
import TypedText from "./TypedText";

// Props: { clue, text, locationName, wet?: boolean, onClose: () => void }
// `wet` adds the hair and starts the slow stain. The text underneath is never covered.
export default function ClueCard({ clue, text, locationName, wet = false, glitch = false, typing = null, onClose }) {
  const [damp, setDamp] = useState(false);
  const [whisper, setWhisper] = useState(false);
  useEffect(() => {
    if (!glitch) return;
    const on = setTimeout(() => setWhisper(true), 2500);
    const off = setTimeout(() => setWhisper(false), 3500);
    return () => { clearTimeout(on); clearTimeout(off); };
  }, [glitch]);

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
      <TypedText text={text} cues={typing ? VO_CUES[clue.id] : null} clock={typing ? typing.clock : null} />
      {whisper && <p className="glitch" aria-hidden="true">k-a-g-u-t-a-b-a</p>}
      <button className="primary" onClick={onClose}>Close</button>
      <img className="hair" src={ASSETS.hair.src} style={blendStyle(ASSETS.hair)} alt="" aria-hidden="true" draggable="false" />
      <img className="stain" src={ASSETS.stain.src} style={blendStyle(ASSETS.stain)} alt="" aria-hidden="true" draggable="false" />
    </article>
  );
}