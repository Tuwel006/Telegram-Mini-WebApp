// Ball.js
import React from 'react';

const Ball = ({ id, onCollect, position, speed }) => (
  <div
  onClick={() => onCollect(id, 'ball')}
  className="bg-blue-500 rounded-full w-8 h-8 absolute cursor-pointer"
  style={{
    left: `${position}%`,
    animation: `fall ${speed}s linear`,
    }}
  ></div>
);

export default Ball;
