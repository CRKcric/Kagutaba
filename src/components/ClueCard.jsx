import { useEffect, useState } from "react";

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
      <svg className="hair" viewBox="0 0 180 60" aria-hidden="true">
        <path d="M2 40C30 6 60 54 92 28s56 22 86-8" stroke="#0b0807" strokeWidth="1.3" fill="none" />
      </svg>
      <div className="stain" />
    </article>
  );
}