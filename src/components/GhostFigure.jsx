import { useEffect, useState } from "react";
import { ASSETS, blendStyle } from "../data/assets";

export default function GhostFigure({ visits }) {
  const [shown, setShown] = useState(Math.max(visits - 1, 1));
  useEffect(() => {
    const t = setTimeout(() => setShown(visits), 6000);
    return () => clearTimeout(t);
  }, [visits]);

  const v = Math.min(shown, 5);
  const asset = v >= 4 ? ASSETS.ghostFacing : ASSETS.ghost;
  return (
    <img className="ghost" data-visit={v} src={asset.src}
      style={blendStyle(asset)} alt="" aria-hidden="true" draggable="false" />
  );
}