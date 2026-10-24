// Props: { locations, onEnter(id), onOpenJournal(), onOpenRitual() }
export default function VillageMap({ locations, onEnter, onOpenJournal, onOpenRitual }) {
  return (
    <section className="map">
      <h2>The village</h2>
      <p className="hint">Three places hold what Hayashi left behind.</p>
      <ul className="places">
        {Object.values(locations).map((loc) => (
          <li key={loc.id}>
            <button className="place" onClick={() => onEnter(loc.id)}>
              <span className="place-name">{loc.name}</span>
              <span className="place-blurb">{loc.blurb}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="row">
        <button onClick={onOpenJournal}>Journal</button>
        <button onClick={onOpenRitual}>Perform the ritual</button>
      </div>
    </section>
  );
}