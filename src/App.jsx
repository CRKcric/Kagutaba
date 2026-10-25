import { allSources } from "./data/assets";
import { useEffect, useReducer, useState } from "react";
import { reducer, getInitialState } from "./state/gameState";
import { LOCATIONS, JOURNAL_LINES } from "./data/clues";
import { SvgDefs } from "./components/art";
import StartScreen from "./components/StartScreen";
import VillageMap from "./components/VillageMap";
import LocationView from "./components/LocationView";
import EvidenceJournal from "./components/EvidenceJournal";
import RitualPuzzle from "./components/RitualPuzzle";
import TapeCounter from "./components/TapeCounter";
import ScareOverlay from "./components/ScareOverlay";
import EndingScreen from "./components/EndingScreen";
import * as sound from "./audio/sound";

const DAMP = {
  third: "The film is damp. It should not be damp.",
  you: "The film is damp. It should not be damp.",
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const [scare, setScare] = useState(null); // "J1" | "J2" | "J3" | null
  const [clockLine, setClockLine] = useState(null);
  const { screen, currentLocation } = state;

  // Gentle Mode class on <body> slows the ghost fade.
  useEffect(() => {
    document.body.classList.toggle("gentle", state.gentleMode);
  }, [state.gentleMode]);

  // Load every image up front so the scares land on time.
  useEffect(() => {
  allSources().forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}, []);

  useEffect(() => { sound.setMuted(state.muted); }, [state.muted]);
  useEffect(() => { sound.setGentle(state.gentleMode); }, [state.gentleMode]);
  useEffect(() => {
    const playing = screen !== "start" && screen !== "ending" && screen !== "lost";
    sound.setAmbience({
      room: playing,
      hiss: screen === "location" && currentLocation === "house",
      water: screen === "location" && currentLocation === "shrine",
    });
    if (screen === "lost") sound.sting("sharp");
  }, [screen, currentLocation]);

  // B1: tab title changes while the player is away.
  useEffect(() => {
    if (screen === "start") return;
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? "keep watching" : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, [screen]);

  // B2 voice: "you" once any location has been visited twice.
  const you = Object.values(state.visits).some((v) => v >= 2);
    // B2: after 2 AM, the first revisit notes the device clock. Once only.
  useEffect(() => {
    if (!you || state.firedBeats.includes("B2")) return;
    dispatch({ type: "FIRE_BEAT", id: "B2" });
    const d = new Date();
    if (d.getHours() >= 2 && d.getHours() < 6) {
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setClockLine(`It is ${hh}:${mm}. You should not be awake.`);
    }
  }, [you, state.firedBeats]);
  const entries = state.discoveredClues
  .filter((id) => JOURNAL_LINES[id])
  .flatMap((id) => (id === "E2" ? [JOURNAL_LINES[id], DAMP] : [JOURNAL_LINES[id]]));
  const note = (text) => entries.push({ third: text, you: text });
  Object.values(state.visits).forEach((n) => {
    if (n === 2) note("Nothing new here.");
    if (n === 3) note("Why did you come back?");
    if (n >= 4) note("It likes that you came back.");
  });
  if (clockLine) note(clockLine);
  if (state.repeatedWrong) note("You keep choosing the same wrong answer.");
  if (state.wrongAttempts >= 3) note("It is learning your order.");
  
  const toMap = () => dispatch({ type: "OPEN_MAP" });

  return (
    <>
      <SvgDefs />
      <div className="bar">
        {import.meta.env.DEV && <button onClick={() => setScare("J1")}>Test scare</button>}
        <button aria-pressed={state.muted} onClick={() => dispatch({ type: "TOGGLE_MUTE" })}>
          {state.muted ? "Sound off" : "Sound on"}
        </button>
        <button aria-pressed={state.gentleMode} onClick={() => dispatch({ type: "TOGGLE_GENTLE" })}>
          {state.gentleMode ? "Gentle mode: on" : "Gentle mode: off"}
        </button>
        <button onClick={() => document.fullscreenElement? document.exitFullscreen(): document.documentElement.requestFullscreen?.()}>Fullscreen</button>
      </div>

      <main className="stage" data-screen={screen}>
        {screen === "start" && (
          <StartScreen
            onStart={() => { sound.unlock(); dispatch({ type: "START" }); }}
          />
        )}

        {screen === "map" && (
          <VillageMap
            locations={LOCATIONS}
            onEnter={(id) => dispatch({ type: "ENTER_LOCATION", id })}
            onOpenJournal={() => dispatch({ type: "OPEN_JOURNAL" })}
            onOpenRitual={() => dispatch({ type: "OPEN_RITUAL" })}
          />
        )}

        {screen === "location" && currentLocation && (
          <LocationView
            location={LOCATIONS[currentLocation]}
            visits={state.visits}
            muted={state.muted}
            onDiscover={(id) => {
              dispatch({ type: "DISCOVER_CLUE", id });
              if (id === "U3" && state.visits.shrine >= 3 && !state.firedBeats.includes("J2")) {
                dispatch({ type: "FIRE_BEAT", id: "J2" });
                sound.duck(2400);
                setTimeout(() => { setScare("J2"); sound.sting("low"); }, 2000);
              }
            }}
            onCloseClue={(clueId) => {
              if (
                clueId === "E2" &&
                state.currentLocation === "archive" &&
                state.visits.archive === 2 &&
                !state.firedBeats.includes("J1")
              ) {
                dispatch({ type: "FIRE_BEAT", id: "J1" });
                dispatch({ type: "ADD_TAPE", amount: 1 });
                setScare("J1");
                sound.sting("sharp");
              }
            }}
            onBack={toMap}
          />
        )}

        {screen === "journal" && (
          <section>
            <h2>Journal</h2>
            <EvidenceJournal entries={entries} you={you} />
            <button className="back" onClick={toMap}>Back to the village</button>
          </section>
        )}

        {screen === "ritual" && (
          <section>
            <h2>The ritual</h2>
            <p className="hint">Tap or drag each act into a slot, in the order you think is right.</p>
            <RitualPuzzle
              slots={state.ritualSlots}
              onPlace={(index, name) => dispatch({ type: "PLACE_TILE", index, name })}
              onRemove={(index) => dispatch({ type: "REMOVE_TILE", index })}
              onSubmit={() => dispatch({ type: "SUBMIT_RITUAL" })}
            />
            <button className="back" onClick={toMap}>Back to the village</button>
          </section>
        )}

        {screen !== "start" && screen !== "ending" && screen !== "lost" && <TapeCounter value={state.tapeCounter} />}
      </main>
      {(screen === "ending" || screen === "lost") && (
        <EndingScreen status={state.status} gentleMode={state.gentleMode} onRestart={() => dispatch({ type: "RESTART" })} />
      )}
      <ScareOverlay scare={scare} gentleMode={state.gentleMode} onDone={() => setScare(null)} />
    </>
  );
}