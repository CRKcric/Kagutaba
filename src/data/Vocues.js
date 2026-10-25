// Seconds into each voice file when each sentence of the clue starts being spoken.
// Measured from the recordings (pauses between sentences). If you re-generate a voice
// file, re-measure with:  ffmpeg -i file.mp3 -af silencedetect=noise=-38dB:d=0.35 -f null -
// The number of cues must equal the number of sentences in the clue text.
export const VO_CUES = {
  E1: [1.3, 5.8, 6.85, 8.1, 9.2, 11.6], // "The old ritual had four acts." / "The bow." / "The clap." / ...
  E2: [0.1, 4.6],                        // two sentences
};

export function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]*\s*/g) || [text];
}

// How many characters of `text` should be showing at time `t` (seconds).
// Each sentence types in at its cue, fast enough to finish before the next cue.
export function revealedChars(text, cues, t, msPerChar = 55) {
  const parts = splitSentences(text);
  if (!cues || cues.length !== parts.length) {
    // no usable cues: plain even typing
    return Math.max(0, Math.min(text.length, Math.floor(((t - 0.4) * 1000) / msPerChar)));
  }
  let total = 0;
  parts.forEach((p, i) => {
    const begin = cues[i];
    const avail = i + 1 < cues.length ? cues[i + 1] - begin : Infinity;
    const ms = Math.min(msPerChar, (avail * 1000 * 0.8) / p.length);
    total += Math.max(0, Math.min(p.length, Math.floor(((t - begin) * 1000) / ms)));
  });
  return total;
}