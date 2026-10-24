// Tiny sound manager. Browsers block audio until a click, so Start calls unlock().
const FILES = {
  room: "/audio/room-tone.mp3",
  hiss: "/audio/tape-hiss.mp3",
  water: "/audio/water.mp3",
  knock: "/audio/knock.mp3",
  sharp: "/audio/sting-sharp.mp3",
  low: "/audio/sting-low.mp3",
  breath: "/audio/fx-breath.mp3",
  voE1: "/audio/vo-hayashi-e1.mp3",
  voWhisper: "/audio/vo-whisper.mp3",
  voReturn: "/audio/vo-return.mp3",
  voE2: "/audio/vo-okabe-e2.mp3",
};
const LOOPS = ["room", "hiss", "water"];
const BASE = { room: 0.35, hiss: 0.18, water: 0.4 }; // loop volumes, tune by ear
const VOICES = ["voE1", "voWhisper", "voReturn", "voE2"];
const STINGS = ["knock", "sharp", "low", "breath", ...VOICES];

let els = {};
let unlocked = false;
let muted = false;
let gentle = false;
let ducked = false;
let want = { room: false, hiss: false, water: false };

function apply() {
  if (!unlocked) return;
  for (const n of LOOPS) {
    const a = els[n];
    const on = want[n] && !muted && !ducked;
    if (on) {
      a.volume = BASE[n];
      if (a.paused) a.play().catch(() => {});
    } else if (!a.paused) {
      a.pause();
    }
  }
}

export function unlock() {
  if (unlocked) return;
  unlocked = true;
  for (const n of Object.keys(FILES)) {
    const a = new Audio(FILES[n]);
    a.preload = "auto";
    if (LOOPS.includes(n)) a.loop = true;
    els[n] = a;
  }
  apply();
}

export function setAmbience({ room = false, hiss = false, water = false }) {
  want = { room, hiss, water };
  apply();
}

export function setMuted(m) {
  muted = m;
  if (m) STINGS.forEach((n) => els[n]?.pause());
  apply();
}

export function setGentle(g) {
  gentle = g;
}

// name: "knock" | "sharp" | "low"
export function sting(name) {
  const a = els[name];
  if (!unlocked || muted || !a) return;
  a.currentTime = 0;
  a.volume = gentle ? 0.3 : 0.9;
  a.play().catch(() => {});
}

// Drop all ambience to silence for a moment (J2).
export function duck(ms) {
  ducked = true;
  apply();
  setTimeout(() => {
    ducked = false;
    apply();
  }, ms);
}

// Voice lines. Returns the audio element (so you can use onended) or null if muted.
export function voice(name, volume = 0.9) {
  const a = els[name];
  if (!unlocked || muted || !a) return null;
  a.currentTime = 0;
  a.volume = volume;
  a.play().catch(() => {});
  return a;
}

export function stopVoices() {
  VOICES.forEach((n) => {
    const a = els[n];
    if (a) {
      a.onended = null;
      a.pause();
      a.currentTime = 0;
    }
  });
}

// Ending: slow breath just before the cut to black.
export function breath() {
  const a = els.breath;
  if (!unlocked || muted || !a) return;
  a.currentTime = 0;
  a.volume = gentle ? 0.3 : 0.6;
  a.play().catch(() => {});
}