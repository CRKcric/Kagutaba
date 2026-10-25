import { useEffect, useState } from "react";
import { ASSETS, blendStyle } from "../data/assets";

export default function GhostFigure({ visits }) {
  // shows last visit's size first, then creeps to the new one after 6s
  const [shown, setShown] = useState(Math.max(visits - 1, 1));
  useEffect(() => {
    const t = setTimeout(() => setShown(visits), 6000);
    return () => clearTimeout(t);
  }, [visits]);

  const v = Math.min(shown, 5);
  const asset = v >= 4 ? ASSETS.ghostFacing : ASSETS.ghost;

  return (
    <>
      <img className="ghost" data-visit={v} src={asset.src}
        style={blendStyle(asset)} alt="" aria-hidden="true" draggable="false" />
      {/* same box as the ghost, so the eyes scale, sway and drift with it */}
      <div className="ghost ghost-eyes" data-visit={v} aria-hidden="true">
        <i className="eye" style={{ left: "41.3%", top: "9.7%" }} />
        <i className="eye" style={{ left: "45.3%", top: "8.1%" }} />
      </div>
    </>
  );
}