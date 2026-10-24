import { ASSETS, blendStyle } from "../data/assets";

// Props: { visits: number }
export default function GhostFigure({ visits }) {
  const asset = visits >= 4 ? ASSETS.ghostFacing : ASSETS.ghost;
  return (
    <img
      className="ghost"
      data-visit={Math.min(visits, 4)}
      src={asset.src}
      style={blendStyle(asset)}
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  );
}