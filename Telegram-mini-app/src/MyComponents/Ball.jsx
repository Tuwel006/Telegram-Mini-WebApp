// Ball.js
import React from 'react';
import star from '../icon/star.png'

const Ball = ({ id, onCollect, position, speed }) => (
  <div
  onClick={() => onCollect(id, 'ball')}
  className=" absolute cursor-pointer"
  style={{
    left: `${position}%`,
    animation: `fall ${speed}s linear`,
    }}
  >
  <img alt='ball' src={star} className='' style={{height: '35px', width: '40px',position:'relative',top:'0px',left: '0px'}}></img>

  </div>
);

export default Ball;
