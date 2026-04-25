import { useEffect, useRef, useState } from "react";

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function App() {
  const [isWalking, setIsWalking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [walks, setWalks] = useState([]);
  const timerId = useRef(null);

  const startWalkTimer = () => {
    if (timerId.current) return; // Prevent multiple timers
    setElapsedSeconds(0);
    timerId.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const resetWalkTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    setWalks((prevWalks) => [...prevWalks, elapsedSeconds]);
    setElapsedSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, []);

  const onWalk = () => {
    setIsWalking(true);
    startWalkTimer();
  };

  const onEndWalk = () => {
    setIsWalking(false);
    resetWalkTimer();
  };

  return (
    <>
      <h1>Dog Tracker</h1>
      <h2>Dog name: Jesse</h2>
      <h2>Dog breed: Golden Retriever</h2>
      <h2>Dog age: 2</h2>
      <section>
        <h3>Walks:</h3>
        {walks.map((walk, index) => (
          <p key={index}>
            Walk {index + 1}: {formatTime(walk)}
          </p>
        ))}

        <p>Stopwatch: {formatTime(elapsedSeconds)}</p>

        {isWalking ? (
          <>
            <p>Currently walking...</p>
            <button onClick={onEndWalk}>End walk</button>
          </>
        ) : (
          <button onClick={onWalk}>Start walk</button>
        )}
      </section>
    </>
  );
}

export default App;
