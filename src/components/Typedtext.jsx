import { useEffect, useRef, useState } from "react";
import { revealedChars } from "../data/voCues";

// Types the text in, following `clock()` (seconds). Click the text to skip to the end.
function Typing({ text, cues, clock }) {
  const [n, setN] = useState(0);
  const skip = useRef(false);

  useEffect(() => {
    let raf;
    let best = 0;
    const tick = () => {
      const c = skip.current ? text.length : revealedChars(text, cues, clock());
      if (c > best) { best = c; setN(c); }   // never goes backwards
      if (best < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cues, clock]);

  return (
    <p className="typed" onClick={() => { skip.current = true; }} title="Click to skip">
      <span className="sr">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {n < text.length && <span className="caret" aria-hidden="true" />}
      {/* the untyped rest keeps its space, so the card never resizes while typing */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{text.slice(n)}</span>
    </p>
  );
}

// Props: { text, cues?: number[], clock?: () => seconds }  (no clock = plain text)
export default function TypedText({ text, cues = null, clock = null }) {
  return clock ? <Typing text={text} cues={cues} clock={clock} /> : <p>{text}</p>;
}