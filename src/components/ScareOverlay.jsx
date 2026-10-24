import { useEffect, useState } from "react";
import { ASSETS } from "../data/assets";

// Props: { scare: "J1" | "J2" | "J3" | null, gentleMode: boolean, onDone: () => void }
// Normal: hard cut for 0.7s. Gentle Mode or reduced motion: slow fade, dimmer, no cut.
export default function ScareOverlay({ scare, gentleMode, onDone }) {
  const [phase, setPhase] = useState("idle"); // idle | in | out
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soft = gentleMode || reduced;

  useEffect(() => {
    if (!scare) return;
    const hold = soft ? 2600 : 700;
    const t0 = setTimeout(() => setPhase("in"), 30);
    const t1 = setTimeout(() => setPhase("out"), 30 + hold);
    const t2 = setTimeout(() => {
      setPhase("idle");
      onDone?.();
    }, 30 + hold + 500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [scare]);

  const style = {
    opacity: phase === "in" ? (soft ? 0.7 : 1) : 0,
    transition:
      phase === "in" ? (soft ? "opacity 1.6s ease" : "none") : "opacity .35s ease",
  };

  return (
    <div className="scare" data-scare={scare} style={style} aria-hidden="true">
      <img src={ASSETS.face.src} alt="" draggable="false" />
    </div>
  );
}