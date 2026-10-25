import { useEffect, useRef, useState } from "react";
import { ASSETS } from "../data/assets";
import { END_CREDIT_LINES } from "../data/credits";
import * as sound from "../audio/sound";

// Props: { status: "won" | "lost", onRestart() }
// Mount this when state.status is "won" or "lost". It runs itself with timers.
// Win: seal, "RITUAL COMPLETE", pause, "YOU MAY LEAVE", EXIT, then the last screen.
const ORDER = ["start", "seal", "sealout", "l1", "l2", "exit", "dark", "came", "ghost", "cut", "name", "end"];
const WON = [["seal", 200], ["sealout", 3500], ["l1", 4600], ["l2", 8600], ["exit", 10600]];
const AFTER = [["dark", 0], ["came", 1800], ["ghost", 4600], ["cut", 11800], ["name", 13200], ["end", 17200]];
const LOST = [["face", 30], ["text", 1100], ["end", 3600]];
const LOST_ORDER = ["start", "face", "text", "end"];

export default function EndingScreen({ status, gentleMode, onRestart }) {
  const [phase, setPhase] = useState("start");
  const timers = useRef([]);
  const run = (steps) => steps.forEach(([p, ms]) => timers.current.push(setTimeout(() => setPhase(p), ms)));

  useEffect(() => {
    run(status === "won" ? WON : LOST);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [status]);
  
  useEffect(() => {
    if (phase !== "ghost") return;
    const t = setTimeout(() => sound.breath(), 5800);
    return () => clearTimeout(t);
  }, [phase]);

  // whisper "kagutaba" just as the word fades in
    useEffect(() => {
    if (phase !== "name") return;
    const t = setTimeout(() => sound.voice("voWhisper", gentleMode ? 0.5 : 0.9), 400);
    return () => clearTimeout(t);
    }, [phase]);

  const at = (p) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  if (status === "lost") {
  const lostAt = (p) => LOST_ORDER.indexOf(phase) >= LOST_ORDER.indexOf(p);
  return (
    <div className={"ending" + (gentleMode ? " gentle" : "")}>
      <img className={"e-lossface" + (phase === "face" ? " on" : "")} src={ASSETS.face.src} alt="" />
      <p className={"e-line" + (lostAt("text") ? " on" : "")}>THE TAPE ENDS.</p>
      <button className={"e-btn" + (lostAt("end") ? " on" : "")} onClick={onRestart}>Begin again</button>
    </div>
  );
}

  return (
    <div className="ending" data-phase={phase}>
      <div className={"e-stage" + (at("dark") ? " gone" : "")}>
        <img className={"e-seal" + (at("seal") && !at("sealout") ? " on" : "")} src={ASSETS.seal.src} alt="" />
        <p className={"e-line" + (at("l1") ? " on" : "")}>THE RITUAL IS COMPLETE.</p>
        <p className={"e-line" + (at("l2") ? " on" : "")}>YOU MAY LEAVE.</p>
        <button
          className={"e-btn" + (at("exit") ? " on" : "")}
          disabled={!at("exit") || at("dark")}
          onClick={() => run(AFTER)}
        >
          EXIT
        </button>
      </div>
      <div className="e-stage2">
        <img className={"e-ghost" + (at("ghost") && !at("cut") ? " on" : "")} src={ASSETS.ghostFacing.src} alt="" />
        <p className={"e-line e-big" + (at("came") && !at("cut") ? " on" : "")}>Something came with you.</p>
        <p className={"e-line e-name" + (at("name") ? " on" : "")}>KAGUTABA.</p>
        <button className={"e-btn" + (at("end") ? " on" : "")} onClick={onRestart}>Begin again</button>
        <div className={"credit" + (at("end") ? " on" : "")}>
         {END_CREDIT_LINES.map((l) => <p key={l}>{l}</p>)}
        </div>
      </div>
    </div>
  );
}