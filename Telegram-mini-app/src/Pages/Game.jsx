// src/pages/Game.js
import React, { useState, useEffect } from 'react';
import Ball from '../MyComponents/Ball';
import Bomb from '../MyComponents/Bomb';

const Game = () => {
  const [points, setPoints] = useState(0);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [animatePoints, setAnimatePoints] = useState([]);
  const [timer, setTimer] = useState(30); // Timer state

  useEffect(() => {
    let spawnInterval;
    if (gameActive) {
      // Start the spawn interval for falling objects
      spawnInterval = setInterval(() => {
        const type = Math.random() < 0.15 ? 'bomb' : 'ball';
        const id = Date.now() + Math.random();
        const position = Math.floor(Math.random() * 90);
        
        const speed = Math.max(Math.random() * 2 + 3, 4); 

        setFallingObjects((prevObjects) => [
          ...prevObjects,
          { id, type, position, speed },
        ]);

        setTimeout(() => {
          setFallingObjects((prevObjects) =>
            prevObjects.filter((obj) => obj.id !== id)
          );
        }, speed * 1000);
      }, 300); // Spawn new objects every 300ms

      // Timer countdown logic
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerInterval);
            setGameActive(false);
            setShowClaimButton(true);
            return 0; // Stop the timer at 0
          }
          return prevTimer - 1;
        });
      }, 1000); // Decrease timer every second

      return () => {
        clearInterval(spawnInterval);
        clearInterval(timerInterval); // Clear timer interval on cleanup
      };
    }
  }, [gameActive]);

  const handleCollect = (id, type, ballPosition) => {
    if (type === 'bomb') {
      setPoints(0);
    } else {
      setPoints((prevPoints) => prevPoints + 1);
      // Animate +1 effect
      setAnimatePoints((prev) => [
        ...prev,
        { id: Date.now(), position: ballPosition },
      ]);
    }
    setFallingObjects((prevObjects) =>
      prevObjects.filter((obj) => obj.id !== id)
    );
  };

  const handleStartGame = () => {
    setGameActive(true);
    setPoints(0);
    setFallingObjects([]);
    setShowClaimButton(false);
    setAnimatePoints([]);
    setTimer(30); // Reset timer to 30 seconds
  };

  const handleClaimPoints = () => {
    // Logic to store total points (e.g., save to a database)
    alert(`Claimed ${points} points!`); // Replace with actual storage logic
    handleStartGame(); // Restart the game
  };

  return (
    <div className="bg-blue-100 h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">Catch the Falling Balls!</h1>
      <div className="text-2xl font-semibold text-center fixed top-5 z-10">
        Points: {points}
      </div>
      <div className="text-2xl font-semibold text-center fixed top-10 z-10">
        Timer: {timer}s
      </div>

      <div 
        className="game-board relative w-full h-full overflow-hidden touch-none"
        style={{ touchAction: 'none' }} 
      >
        {fallingObjects.map((obj) =>
          obj.type === 'ball' ? (
            <Ball
              key={obj.id}
              id={obj.id}
              position={obj.position}
              speed={obj.speed}
              onCollect={(id) => handleCollect(id, 'ball', obj.position)}
            />
          ) : (
            <Bomb
              key={obj.id}
              id={obj.id}
              position={obj.position}
              speed={obj.speed}
              onCollect={(id) => handleCollect(id, 'bomb', obj.position)}
            />
          )
        )}

        {/* Animate points display */}
        {animatePoints.map(({ id, position }) => (
          <div
            key={id}
            className="absolute text-lg font-bold text-red-600"
            style={{
              left: `${position}%`,
              bottom: '20%', // Start position
              animation: 'moveUp 1s forwards',
            }}
          >
            +1
          </div>
        ))}
      </div>

      {!gameActive && !showClaimButton && (
        <button
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      )}

      {showClaimButton && (
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleClaimPoints}
        >
          Claim Points
        </button>
      )}
    </div>
  );
};

export default Game;
