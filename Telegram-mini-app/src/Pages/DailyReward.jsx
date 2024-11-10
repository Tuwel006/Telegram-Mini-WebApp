import React, { useContext } from 'react';
import dolla_coin from '../icon/dollar-coin.png';
import { UserContext } from '../UserContext';

export default function DailyReward() {
    const { continueDay } = useContext(UserContext);
    const handleRewardOpen = (index) => {
        
    }
  return (
    <>
        <h1 className='text-2xl mb-4'>Daily Reward</h1>
{
        <main className='flex-grow overflow-y-auto h-100 w-100 px-2'>
        <div className="grid grid-cols-3 gap-3">
            {Array.from({length: 100}).map((_, index) => (
                <div key={index}>
                <button onClick={()=> {handleRewardOpen(index)}} className={`h-14 w-full bg-blue-400 my-2 flex flex-col items-center text-xl px-2 rounded-xl ${(index<continueDay)?'':'opacity-40'}`}>
                    <div className='flex'>
                    <img alt='dollar_coin' src={dolla_coin} className='' style={{height: '18px', width: '18px',position:'relative',top:'5px',left: '0px'}}></img><p>{20+10*index}</p>
                    </div> 
                    <p>Day {index+1}</p>                   
                </button>
                </div>
            ))}
        </div>
        </main>
        }
    </>
  )
}
