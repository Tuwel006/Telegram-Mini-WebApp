import React, {useContext} from 'react'
import Footer from '../MyComponents/Footer'
import Main from '../MyComponents/Main'
import closeLock from '../icon/closeLock.png'
import { UserContext, UserProvider } from '../UserContext.js'


export default function Widthdraw() {
  const user = useContext(UserContext);
  //const time = user.timeLeft;
  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  };
  formatTime(user.timeLeft);

  return (
    <UserProvider>
        <div className='flex flex-col items-center mt-3 pt-3 h-full w-full bg-gray-800 border-t-4 border-yellow-300 rounded-tl-3xl rounded-tr-3xl'>
          <div className='flex flex-col items-center bg-slate-700 py-4 rounded-3xl w-full'>
          <div className='flex shadow-3xl mb-4'>
            <p className='text-yellow-500 text-6xl'>$</p>
            <p className='text-6xl text-yellow-500'>{user.balance}</p>
          </div>
          <button className='flex h-10 px-4 mt-2 overlay rounded-lg border-3 bg-blue-600 text-yellow-500 o-5 text-center text-xl'>
            Widthdraw
            <img alt='closeLock' src={closeLock} className='' style={{height: '35px', width: '40px',position:'relative',top:'-3px',left: '0px'}}></img>
          </button>
          </div>
        </div>
        <div>
      <h2>Time Remaining: {formatTime(user.timeLeft)}</h2>
    </div>
        </UserProvider>
  )
}
