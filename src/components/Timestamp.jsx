import { useState } from "react";

// Each location is a different tape. Edit freely.
const TAPES = {
  house: { date: "APR 12 2004", time: "02:14" },
  archive: { date: "APR 05 2004", time: "16:40" },
  shrine: { date: "APR 11 2004", time: "05:52" },
};

// Props: { location: "house" | "archive" | "shrine", visit: number }
// Visit 1: normal. Visit 2: the exact same time (frozen). Visit 3+: the viewer's real clock.
export default function Timestamp({ location, visit }) {
  const [now] = useState(() => new Date());
  let { date, time } = TAPES[location];
  if (visit >= 3) {
    date = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      .replace(",", "").toUpperCase();
    time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  return (
    <div className="stamp" aria-hidden="true">
      <span>{date}  {time}</span>
      <span>PLAY ▶</span>
    </div>
  );
}