import { useEffect, useRef, useState } from "react";
import { ASSETS } from "../data/assets";

// Props: { status: "won" | "lost", onRestart() }
// Mount this when state.status is "won" or "lost". It runs itself with timers.
// Win: seal, "RITUAL COMPLETE", pause, "YOU MAY LEAVE", EXIT, then the last screen.
const ORDER = ["start", "seal", "sealout", "l1", "l2", "exit", "dark", "came", "ghost", "cut", "name", "end"];
const WON = [["seal", 200], ["sealout", 3500], ["l1", 4600], ["l2", 8600], ["exit", 10600]];
const AFTER = [["dark", 0], ["came", 1800], ["ghost", 4600], ["cut", 11800], ["name", 13200], ["end", 17200]];

const CREDIT = "Inspired by Noroi: The Curse (2005), directed by Kōji Shiraishi. All art, text and sound here are original.";

export default function EndingScreen({ status, onRestart }) {
  const [phase, setPhase] = useState("start");
  const timers = useRef([]);
  const run = (steps) => steps.forEach(([p, ms]) => timers.current.push(setTimeout(() => setPhase(p), ms)));

  useEffect(() => {
    run(status === "won" ? WON : [["end", 2500]]);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [status]);

  const at = (p) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  if (status === "lost") {
    return (
      <div className="ending">
        <p className="e-line on">THE TAPE ENDS.</p>
        <button className={"e-btn" + (at("end") ? " on" : "")} onClick={onRestart}>Begin again</button>
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
        <p className={"credit" + (at("end") ? " on" : "")}>{CREDIT}</p>
      </div>
    </div>
  );
}