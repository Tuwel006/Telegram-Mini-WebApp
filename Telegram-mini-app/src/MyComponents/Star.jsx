// Star.js
import React from 'react';

const Star = ({ id, onCollect }) => {
  return (
    <div
      onClick={() => onCollect(id, 'star')}
      className="star bg-yellow-500 w-10 h-10 absolute top-0 left-1/2 transform -translate-x-1/2 animate-fall cursor-pointer"
    ></div>
  );
};

export default Star;
