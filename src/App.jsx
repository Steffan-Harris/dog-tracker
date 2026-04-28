import { useState } from "react";

const newId = (() => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
})();

const INITIAL_WALKS = [
  { id: newId(), name: "Morning Walk", time: 0 },
  { id: newId(), name: "Afternoon Walk", time: 0 },
];

function App() {
  const [walks, setWalks] = useState(INITIAL_WALKS);
  const [newWalk, setNewWalk] = useState("");

  return (
    <>
      <h1>Dog Walk Tracker: Jesse</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setWalks([...walks, { id: newId(), name: newWalk, time: 0 }]);
          setNewWalk("");
        }}
      >
        <input
          type="text"
          placeholder="Add New Walk"
          value={newWalk}
          onChange={(event) => {
            setNewWalk(event.target.value);
          }}
          aria-label="Add New Walk"
        />
        <button>Submit</button>
      </form>
      <section>
        {walks.length === 0 ? (
          <p>No walks recorded yet.</p>
        ) : (
          <ul>
            {walks.map((walk, index) => (
              <li key={index}>
                {walk.name}: {walk.time} minutes
                <button
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
