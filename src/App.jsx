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

const DOG_NAME_STORAGE_KEY = "dog-tracker-dog-name";
const DEFAULT_DOG_NAME = "Jesse";

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
  const [dogName, setDogName] = useState(() => {
    try {
      return localStorage.getItem(DOG_NAME_STORAGE_KEY) || DEFAULT_DOG_NAME;
    } catch {
      return DEFAULT_DOG_NAME;
    }
  });

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

  useEffect(() => {
    localStorage.setItem(DOG_NAME_STORAGE_KEY, dogName);
  }, [dogName]);

  const canSubmit = newWalk.trim().length > 0;
  const displayDogName = dogName.trim() || DEFAULT_DOG_NAME;

  return (
    <main className="dog-tracker">
      <h1 className="dog-tracker__title">Dog Walk Tracker: {displayDogName}</h1>
      <div className="dog-tracker__dog-name">
        <label className="dog-tracker__label" htmlFor="dog-name">
          Dog name
        </label>
        <input
          id="dog-name"
          className="dog-tracker__input dog-tracker__input--dog-name"
          type="text"
          placeholder="Enter dog name"
          value={dogName}
          onChange={(event) => setDogName(event.target.value)}
          aria-label="Dog name"
        />
      </div>
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
