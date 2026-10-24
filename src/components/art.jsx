// Shared SVG symbols (ghost, face) and the three location backgrounds.
import { ASSETS } from "../data/assets";
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="ghost" viewBox="0 0 100 200">
          <path d="M12 200C12 120 32 84 50 80c18 4 38 40 38 120z" fill="#050404" />
          <ellipse cx="50" cy="40" rx="15" ry="19" fill="#050404" />
          <path d="M33 34C26 60 22 100 24 150c6-30 8-52 14-68zM67 34c7 26 11 66 9 116-6-30-8-52-14-68zM44 52c-4 40-3 70 0 110 3-40 4-70 0-110z" fill="#050404" />
          <ellipse cx="44" cy="42" rx="2.4" ry="1.2" fill="var(--eyes,transparent)" />
          <ellipse cx="56" cy="42" rx="2.4" ry="1.2" fill="var(--eyes,transparent)" />
        </symbol>
        <symbol id="face" viewBox="0 0 200 270">
          <path d="M40 40C20 100 24 190 36 260c10-60 8-120 22-170zM160 40c20 60 16 150 4 220-10-60-8-120-22-170z" fill="#030202" />
          <ellipse cx="100" cy="125" rx="62" ry="86" fill="#b9b09a" />
          <path d="M44 70C70 40 130 40 156 70 140 56 60 56 44 70z" fill="#030202" />
          <ellipse cx="72" cy="108" rx="17" ry="25" fill="#050303" />
          <ellipse cx="128" cy="108" rx="17" ry="25" fill="#050303" />
          <circle cx="73" cy="112" r="3" fill="#b9b09a" />
          <circle cx="127" cy="112" r="3" fill="#b9b09a" />
          <path d="M100 118c-5 16-6 28 0 34" stroke="#6d6552" strokeWidth="3" fill="none" />
          <ellipse cx="100" cy="188" rx="22" ry="40" fill="#050303" />
          <path d="M86 166v44M100 162v52M114 166v44" stroke="#b9b09a" strokeWidth="2" opacity=".5" />
          <path d="M62 150c6 12 8 24 6 40M138 150c-6 12-8 24-6 40" stroke="#6d6552" strokeWidth="3" fill="none" opacity=".6" />
        </symbol>
      </defs>
    </svg>
  );
}

const SCENES = {
  house: (
    <>
      <rect width="320" height="200" fill="#1a1715" />
      <rect x="200" y="28" width="62" height="84" fill="#2b3338" stroke="#0a0908" strokeWidth="4" />
      <path d="M231 28v84M200 70h62" stroke="#0a0908" strokeWidth="3" />
      <rect y="150" width="320" height="50" fill="#0e0c0b" />
      <ellipse cx="90" cy="60" rx="60" ry="34" fill="#0a0807" opacity=".7" />
      <rect x="40" y="132" width="150" height="9" fill="#2a211b" />
      <path d="M52 141v28M178 141v28" stroke="#2a211b" strokeWidth="6" />
      <rect x="72" y="112" width="62" height="20" fill="#35302b" />
      <circle cx="90" cy="122" r="6" fill="#0b0a09" />
      <circle cx="116" cy="122" r="6" fill="#0b0a09" />
      <g fill="#c9bfa4"><rect x="146" y="120" width="5" height="12" /><rect x="158" y="122" width="5" height="10" /><rect x="170" y="121" width="5" height="11" /></g>
      <g fill="#b4533a"><circle cx="148.5" cy="116" r="2.2" /><circle cx="160.5" cy="118" r="2.2" /><circle cx="172.5" cy="117" r="2.2" /></g>
    </>
  ),
  archive: (
    <>
      <rect width="320" height="200" fill="#181513" />
      <g fill="#2a2420"><rect x="0" y="52" width="320" height="6" /><rect x="0" y="104" width="320" height="6" /><rect x="0" y="156" width="320" height="6" /></g>
      <g fill="#3b3028">
        <rect x="10" y="22" width="12" height="30" /><rect x="24" y="30" width="10" height="22" /><rect x="36" y="18" width="14" height="34" /><rect x="60" y="26" width="10" height="26" />
        <rect x="14" y="76" width="14" height="28" /><rect x="30" y="70" width="10" height="34" /><rect x="48" y="80" width="12" height="24" />
        <rect x="20" y="128" width="12" height="28" /><rect x="36" y="122" width="14" height="34" />
      </g>
      <rect x="190" y="98" width="82" height="62" fill="#26211e" stroke="#0a0908" strokeWidth="3" />
      <rect x="202" y="108" width="58" height="38" fill="#7d745e" opacity=".5" />
      <path d="M231 108v38" stroke="#0a0908" strokeWidth="2" opacity=".6" />
    </>
  ),
  shrine: (
    <>
      <defs>
        <linearGradient id="shrine-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2326" /><stop offset="1" stopColor="#050707" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="#12100f" />
      <rect x="82" y="40" width="14" height="110" fill="#3a2623" />
      <rect x="224" y="40" width="14" height="110" fill="#3a2623" />
      <rect x="66" y="34" width="188" height="12" fill="#4a2c27" />
      <rect x="74" y="56" width="172" height="6" fill="#2d1c19" />
      <rect y="140" width="320" height="60" fill="url(#shrine-water)" />
      <g stroke="#3b484b" strokeWidth="1" opacity=".6"><path d="M40 160h60M150 170h90M70 184h70M200 156h80" /></g>
      <g fill="#c9bfa4" opacity=".7"><ellipse cx="120" cy="150" rx="7" ry="2.5" /><ellipse cx="160" cy="158" rx="7" ry="2.5" /><ellipse cx="200" cy="148" rx="7" ry="2.5" /></g>
    </>
  ),
};

export function SceneBackground({ id }) {
  return <img className="bg" src={ASSETS.scenes[id].src} alt="" draggable="false" />;
}