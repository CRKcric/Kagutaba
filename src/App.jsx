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

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const [scare, setScare] = useState(null); // "J1" | "J2" | "J3" | null
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
  const entries = state.discoveredClues
    .filter((id) => JOURNAL_LINES[id])
    .map((id) => JOURNAL_LINES[id]);

  const toMap = () => dispatch({ type: "OPEN_MAP" });

  return (
    <>
      <SvgDefs />
      <div className="bar">
        {import.meta.env.DEV && <button onClick={() => setScare("J1")}>Test scare</button>}
        <button aria-pressed={state.muted} onClick={() => dispatch({ type: "TOGGLE_MUTE" })}>
          {state.muted ? "Sound off" : "Sound on"}
        </button>
      </div>

      <main className="stage" data-screen={screen}>
        {screen === "start" && (
          <StartScreen
            gentleMode={state.gentleMode}
            onToggleGentle={() => dispatch({ type: "TOGGLE_GENTLE" })}
            onStart={() => dispatch({ type: "START" })}
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
            onDiscover={(id) => dispatch({ type: "DISCOVER_CLUE", id })}
            onCloseClue={() => {}}
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
            <p className="hint">Drag each act into a slot, in the order you think is right.</p>
            <RitualPuzzle
              slots={state.ritualSlots}
              onPlace={(index, name) => dispatch({ type: "PLACE_TILE", index, name })}
              onRemove={(index) => dispatch({ type: "REMOVE_TILE", index })}
              onSubmit={() => {
                /* TODO: compare state.ritualSlots with CORRECT_ORDER */
              }}
            />
            <button className="back" onClick={toMap}>Back to the village</button>
          </section>
        )}

        {screen !== "start" && <TapeCounter value={state.tapeCounter} />}
      </main>

      <ScareOverlay scare={scare} gentleMode={state.gentleMode} onDone={() => setScare(null)} />
    </>
  );
}