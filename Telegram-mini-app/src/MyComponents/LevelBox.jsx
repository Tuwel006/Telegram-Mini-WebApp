import React, { useState } from 'react';

function LevelBox() {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const maxPoints = 100; // Points needed to fill the box

  const incrementPoints = () => {
    if (points + 10 >= maxPoints) {
      setPoints(0);
      setLevel(level + 1);
    } else {
      setPoints(points + 10);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="w-full max-w-sm">
        <div className="h-8 w-full bg-gray-300 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(points / maxPoints) * 100}%` }}
          ></div>
        </div>
        <p className="mt-4 text-center">Level: {level}</p>
        <p className="text-center">Points: {points}/{maxPoints}</p>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white"
        onClick={incrementPoints}
      >
        Add Points
      </button>
    </div>
  );
}

export default LevelBox;
