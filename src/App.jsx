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
    <>
      <h1>Dog Walk Tracker: Jesse</h1>
      <form
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
          type="text"
          placeholder="Walk name"
          value={newWalk}
          onChange={(event) => setNewWalk(event.target.value)}
          aria-label="Walk name"
        />
        <input
          type="number"
          placeholder="Duration (mins)"
          value={newDuration}
          min="0"
          onChange={(event) => setNewDuration(event.target.value)}
          aria-label="Duration in minutes"
          className="duration-input"
        />
        <button type="submit" disabled={!canSubmit}>
          Add Walk
        </button>
      </form>
      <section>
        {walks.length === 0 ? (
          <p>No walks recorded yet.</p>
        ) : (
          <ul>
            {walks.map((walk) => (
              <li key={walk.id}>
                <div className="walk-info">
                  <span className="walk-name">{walk.name}</span>
                  <span className="walk-meta">
                    {walk.duration} min
                    {walk.date && (
                      <span className="walk-date">
                        {" "}
                        · {formatDate(walk.date)}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  className="delete-btn"
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
    </>
  );
}

export default App;
