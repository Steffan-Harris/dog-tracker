import { useState, useEffect } from "react";

const newId = (() => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
})();

const INITIAL_WALKS = [
  { id: newId(), name: "Morning Walk", duration: 30, date: null },
  { id: newId(), name: "Afternoon Walk", duration: 30, date: null },
];

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function App() {
  const [walks, setWalks] = useState(() => {
    try {
      const stored = localStorage.getItem("dog-tracker-walks");
      return stored ? JSON.parse(stored) : INITIAL_WALKS;
    } catch {
      return INITIAL_WALKS;
    }
  });
  const [newWalk, setNewWalk] = useState("");
  const [newDuration, setNewDuration] = useState("");

  useEffect(() => {
    localStorage.setItem("dog-tracker-walks", JSON.stringify(walks));
  }, [walks]);

  const canSubmit = newWalk.trim().length > 0;

  return (
    <main className="dog-tracker">
      <h1 className="dog-tracker__title">Dog Walk Tracker: Jesse</h1>
      <form
        className="dog-tracker__form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) return;
          setWalks([
            ...walks,
            {
              id: newId(),
              name: newWalk.trim(),
              duration: newDuration === "" ? 0 : Number(newDuration),
              date: new Date().toISOString(),
            },
          ]);
          setNewWalk("");
          setNewDuration("");
        }}
      >
        <input
          className="dog-tracker__input dog-tracker__input--name"
          type="text"
          placeholder="Walk name"
          value={newWalk}
          onChange={(event) => setNewWalk(event.target.value)}
          aria-label="Walk name"
        />
        <input
          className="dog-tracker__input dog-tracker__input--duration"
          type="number"
          placeholder="Duration (mins)"
          value={newDuration}
          min="0"
          onChange={(event) => setNewDuration(event.target.value)}
          aria-label="Duration in minutes"
        />
        <button
          className="dog-tracker__button dog-tracker__button--submit"
          type="submit"
          disabled={!canSubmit}
        >
          Add Walk
        </button>
      </form>
      <section className="dog-tracker__content">
        {walks.length === 0 ? (
          <p className="dog-tracker__empty">No walks recorded yet.</p>
        ) : (
          <ul className="dog-tracker__list">
            {walks.map((walk) => (
              <li key={walk.id} className="dog-tracker__item">
                <div className="dog-tracker__item-info">
                  <span className="dog-tracker__item-name">{walk.name}</span>
                  <span className="dog-tracker__item-meta">
                    {walk.duration} min
                    {walk.date && (
                      <span className="dog-tracker__item-date">
                        {" "}
                        · {formatDate(walk.date)}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  className="dog-tracker__button dog-tracker__button--delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete "${walk.name}"?`,
                      )
                    ) {
                      setWalks(walks.filter((w) => w.id !== walk.id));
                    }
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
