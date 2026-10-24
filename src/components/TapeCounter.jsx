// Props: { value: number }  (state.tapeCounter, 0..10)
export default function TapeCounter({ value }) {
  const pulse = (2.4 - value * 0.17).toFixed(2) + "s";
  return (
    <div className="deck" style={{ "--pulse": pulse }}>
      <div className="reels"><div className="reel" /><div className="reel" /></div>
      <div className="count" aria-live="polite">{String(value).padStart(2, "0")} / 10</div>
      <div className="rec"><i />nothing is recording</div>
    </div>
  );
}