// Game state contract (plan §12). Keep these field names stable: Member 1 builds against them.

export const CORRECT_ORDER = ["BOW", "CLAP", "OFFER", "NAME"];

export const initialState = {
  screen: "start", // start | map | location | journal | ritual | ending | lost
  gentleMode: false,
  muted: false,
  currentLocation: null, // "house" | "archive" | "shrine"
  visits: { house: 0, archive: 0, shrine: 0 },
  discoveredClues: [], // ["E1", "U1", ...]
  clueReads: {}, // { U1: 2, ... }
  tapeCounter: 0, // 0..10
  wrongAttempts: 0,
  repeatedWrong: false,
  lastWrongAnswer: null,
  ritualSlots: [null, null, null, null],
  firedBeats: [], // ["B2", "J1", ...], each fires once
  status: "playing", // playing | won | lost
};

// Builds the starting state. Handles ?demo=1 and prefers-reduced-motion (auto Gentle Mode, plan §9).
export function getInitialState() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const base = { ...initialState, gentleMode: Boolean(reduced) };

  const demo =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("demo") === "1";

  if (demo) {
    // One visit everywhere: the next entry to any location is a revisit.
    return {
      ...base,
      visits: { house: 1, archive: 1, shrine: 1 },
      discoveredClues: ["E1", "E2", "U1", "U2"],
      clueReads: { E1: 1, E2: 1, U1: 1, U2: 1 },
    };
  }
  return base;
}

export function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_GENTLE":
      return { ...state, gentleMode: !state.gentleMode };

    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };

    case "START":
      return { ...state, screen: "map", currentLocation: null };

    case "OPEN_MAP":
      return { ...state, screen: "map", currentLocation: null };

    case "ENTER_LOCATION": {
      const id = action.id;
      return {
        ...state,
        screen: "location",
        currentLocation: id,
        visits: { ...state.visits, [id]: state.visits[id] + 1 },
      };
    }

    case "DISCOVER_CLUE": {
      const id = action.id;
      return {
        ...state,
        discoveredClues: state.discoveredClues.includes(id)
          ? state.discoveredClues
          : [...state.discoveredClues, id],
        clueReads: { ...state.clueReads, [id]: (state.clueReads[id] || 0) + 1 },
      };
    }

    // Fire-once guard (plan §12): a beat id already in firedBeats is a no-op.
    case "FIRE_BEAT":
      return state.firedBeats.includes(action.id)
        ? state
        : { ...state, firedBeats: [...state.firedBeats, action.id] };
    
    case "OPEN_JOURNAL":
      return { ...state, screen: "journal" };

    case "OPEN_RITUAL":
      return { ...state, screen: "ritual" };

    // Drag or tap a tile into a slot. A tile can only sit in one slot at a time.
    case "PLACE_TILE": {
      const slots = state.ritualSlots.map((s) => (s === action.name ? null : s));
      slots[action.index] = action.name;
      return { ...state, ritualSlots: slots };
    }

    case "REMOVE_TILE": {
      const slots = [...state.ritualSlots];
      slots[action.index] = null;
      return { ...state, ritualSlots: slots };
    }
    
        case "SUBMIT_RITUAL": {
      if (state.ritualSlots.includes(null)) return state;
      const answer = state.ritualSlots.join(",");
      if (answer === CORRECT_ORDER.join(",")) {
        return { ...state, screen: "ending", status: "won" };
      }
      const tapeCounter = Math.min(10, state.tapeCounter + 2);
      const lost = tapeCounter >= 10;
      return {
        ...state,
        tapeCounter,
        wrongAttempts: state.wrongAttempts + 1,
        lastWrongAnswer: answer,
        repeatedWrong: state.repeatedWrong || state.lastWrongAnswer === answer,
        ritualSlots: [null, null, null, null],
        ...(lost ? { screen: "lost", status: "lost" } : {}),
      };
    }
    case "ADD_TAPE":
      return { ...state, tapeCounter: Math.min(10, state.tapeCounter + action.amount) };
    
      case "RESTART":
      return {
        ...getInitialState(),
        gentleMode: state.gentleMode,
        muted: state.muted,
      };

    default:
      return state;
  }
}