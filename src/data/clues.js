// Clue data (plan §3 and §4). Essential clues (E*) never change. Atmospheric clues (U*)
// pick a version from the location's visit count, never from randomness.

export const LOCATIONS = {
  house: {
    id: "house",
    name: "The Burned House",
    blurb: "Hayashi’s scorched study. A tape deck sits on the desk.",
    clueIds: ["E1", "U1"],
  },
  archive: {
    id: "archive",
    name: "The Archive",
    blurb: "Okabe’s cluttered room. A film-strip viewer.",
    clueIds: ["E2", "U2"],
  },
  shrine: {
    id: "shrine",
    name: "The Dam Shrine",
    blurb: "A shrine at the edge of dark water. The old village is below.",
    clueIds: ["E3", "U3"],
  },
};

export const LOCATION_IDS = Object.keys(LOCATIONS);

export const CLUES = {
  E1: {
    id: "E1",
    slug: "house-tape",
    location: "house",
    essential: true,
    label: "The tape",
    source: "Hayashi, on tape",
    text: "“The old ritual had four acts. The bow. The clap. The offering. The naming. I never learned the order.”",
  },
  E2: {
    id: "E2",
    slug: "archive-filmstrip",
    location: "archive",
    essential: true,
    label: "The 1978 film",
    source: "Okabe’s note on the 1978 film",
    text: "The officiant bows before anything else. The child speaks the name only after the offering has left their hands.”",
  },
  E3: {
    id: "E3",
    slug: "shrine-inscription",
    location: "shrine",
    essential: true,
    label: "The inscription",
    source: "Carved into the stone",
    text: "THE HANDS CALL BEFORE THE HANDS GIVE.",
  },
  U1: {
    id: "U1",
    slug: "house-candles",
    location: "house",
    essential: false,
    label: "The desk",
    source: "",
    versions: [
      "Three candles are lit on the desk.",
      "Three candles were lit on the desk.",
      "You already put one out.",
    ],
  },
  U2: {
    id: "U2",
    slug: "archive-register",
    location: "archive",
    essential: false,
    label: "The visitor register",
    source: "",
    versions: ["Visitors this year: 1.", "Visitors this year: 2.", "Visitors this year: you."],
  },
  U3: {
    id: "U3",
    slug: "shrine-offerings",
    location: "shrine",
    essential: false,
    label: "The water",
    source: "",
    versions: [
      "Three offerings float on the water.",
      "Three offerings floated on the water.",
      "You already took one.",
    ],
  },
};

// Version selection (plan §12). `visits` is state.visits.
export function getClueText(clue, visits) {
  if (!clue.versions) return clue.text;
  const visit = Math.max(visits[clue.location], 1);
  return clue.versions[Math.min(visit - 1, clue.versions.length - 1)];
}
// Journal entries per essential clue. `third` is the opening voice, `you` is used after the first revisit.
export const JOURNAL_LINES = {
  E1: {
    third: "The researcher plays the tape. Hayashi lists four acts and admits he never learned the order.",
    you: "You play the tape. Hayashi lists four acts and admits he never learned the order.",
  },
  E2: {
    third: "The researcher reads Okabe’s note on the 1978 film: the officiant bows first, and the name comes after the offering.",
    you: "You read Okabe’s note on the 1978 film: the officiant bows first, and the name comes after the offering.",
  },
  E3: {
    third: "The researcher copies the inscription from the stone: the hands call before the hands give.",
    you: "You copy the inscription from the stone: the hands call before the hands give.",
  },
};