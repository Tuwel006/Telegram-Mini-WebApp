import React, {useContext, useEffect, useState} from 'react'
import closeLock from '../icon/closeLock.png'
import { UserContext, UserProvider } from '../UserContext.js';


export default function Widthdraw() {
  const user = useContext(UserContext);
  const timeLeft = user.timeLeft;

  const [time, setTime] = useState('');

  useEffect(()=> {
    const formatTime = (seconds) => {
      if(seconds) {
        const newTime = {
          days: Math.floor(seconds / (24 * 60 * 60)),
          hours: Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
          minutes: Math.floor((seconds % (60 * 60)) / 60),
          seconds: seconds % 60,
        }
        return newTime;
      }
      else {
        return "";
      }
    };
    const newTime = formatTime(timeLeft);
    setTime(newTime);
  },[setTime,timeLeft])

  return (
    <UserProvider>
        <div className='flex flex-col items-center mt-3 pt-3 h-full w-full bg-gray-800 border-t-4 border-yellow-300 rounded-tl-3xl rounded-tr-3xl'>
          <div className='flex flex-col items-center bg-slate-700 py-4 rounded-3xl w-full'>
          <div className='flex shadow-3xl mb-4'>
            <p className='text-yellow-500 text-6xl'>$</p>
            <p className='text-6xl text-yellow-500'>{user.balance.toFixed(2)}</p>
          </div>
          <button className='flex items-center h-10 px-4 mt-2 overlay rounded-lg border-3 bg-blue-600 text-yellow-500 o-5 text-center text-xl'>
            Widthdraw
            <img alt='closeLock' src={closeLock} className='' style={{height: '35px', width: '40px',position:'relative',top:'0px',left: '0px'}}></img>
          </button>
          </div>
          {time.days?<h1 className='text-2xl mt-4'>{String(time.days).padStart(2,'0')}D : {String(time.hours).padStart(2,'0')}H : {String(time.minutes).padStart(2,'0')}M : {String(time.seconds).padStart(2,'0')}S</h1>:''}

        </div>
        <div>
    </div>
        </UserProvider>
  )
}
