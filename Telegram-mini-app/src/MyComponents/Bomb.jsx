// Bomb.js
import React from 'react';
import bomb from '../icon/bomb.png'

const Bomb = ({ id, onCollect, position, speed }) => (
  <div
  onClick={() => onCollect(id, 'bomb')}
  className=" absolute cursor-pointer"
  style={{
    left: `${position}%`,
    animation: `fall ${speed}s linear`,
    }}
  >
   <img alt='bomb' src={bomb} className='' style={{height: '45px', width: '55px',position:'relative',top:'0px',left: '0px'}}></img>

  </div>
);

export default Bomb;
