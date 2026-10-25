import { useEffect, useRef, useState } from "react";
import * as sound from "../audio/sound";
import { CLUES, getClueText } from "../data/clues";
import { SceneBackground } from "./art";
import GhostFigure from "./GhostFigure";
import Timestamp from "./Timestamp";
import ClueCard from "./ClueCard";

// Props: { location, visits, onDiscover(clueId), onCloseClue(clueId), onBack() }
export default function LocationView({ location, visits, muted, onDiscover, onCloseClue, onBack }) {
  const [openId, setOpenId] = useState(null);
  const [caption, setCaption] = useState(null);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const stopAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    sound.stopVoices();
    setCaption(null);
  };
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    sound.stopVoices();
  }, []);

  // Voice lines. The written clue card is always there, so muted players lose nothing.
  const playVoices = (id) => {
    if (id === "E1" && location.id === "house") {
      const showReturn = visits.house >= 3;
      const afterWhisper = () => {
        if (!showReturn) return;
        later(() => {
          const a = sound.voice("voReturn", 0.7);
          setCaption("You came back.");
          if (a) a.onended = () => later(() => setCaption(null), 600);
          else later(() => setCaption(null), 2500);
        }, 800);
      };
      const whisper = () => {
        const w = sound.voice("voWhisper", 0.15);
        if (w) w.onended = afterWhisper;
        else afterWhisper();
      };
      const main = sound.voice("voE1", 0.9);
      if (main) main.onended = () => later(whisper, 600);
      else later(whisper, 2500);
    }
    if (id === "E2" && location.id === "archive") sound.voice("voE2", 0.9);
  };

  const open = (id) => { setOpenId(id); onDiscover(id); playVoices(id); };
  const close = () => { onCloseClue?.(openId); setOpenId(null); stopAll(); };
  const clue = openId ? CLUES[openId] : null;

  // Flashlight: the light circle follows the pointer. Clues are outside the scene, so they stay readable.
  const light = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lx", e.clientX - r.left + "px");
    e.currentTarget.style.setProperty("--ly", e.clientY - r.top + "px");
    e.currentTarget.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5) * 2);
    e.currentTarget.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section className="location">
      <h2>{location.name}</h2>

      <figure className="scene vhs-fx" data-loc={location.id} onPointerMove={light}>
        <SceneBackground id={location.id} />
        <GhostFigure visits={visits[location.id]} />
        <div className="flash" aria-hidden="true" />
        <Timestamp location={location.id} visit={visits[location.id]} />
      </figure>
      <p className="hint">{location.blurb}</p>

      {clue ? (
        <ClueCard
          clue={clue}
          text={getClueText(clue, visits)}
          locationName={location.name}
          wet={clue.id === "E2"}
          glitch={clue.id === "E1" && muted}
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
      {caption && <p className="subtitle" aria-live="polite">{caption}</p>}
    </section>
  );
}