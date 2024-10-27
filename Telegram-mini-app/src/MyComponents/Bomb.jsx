// Bomb.js
import React from 'react';

const Bomb = ({ id, onCollect, position, speed }) => (
  <div
  onClick={() => onCollect(id, 'bomb')}
  className="bg-red-600 rounded-full w-8 h-8 absolute cursor-pointer"
  style={{
    left: `${position}%`,
    animation: `fall ${speed}s linear`,
    }}
  ></div>
);

export default Bomb;
