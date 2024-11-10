import React, {useContext} from 'react';
import { UserContext } from '../UserContext';
import dollar_coin from '../icon/dollar-coin.png';

const TaskVerify = ({taskNumber}) => {
  const{ coin } = useContext(UserContext);
  return (
<>
<div className='m-4 text-center text-xl text-blue-400'>Coplete the task and get the code.</div>
<div className='h-full w-full flex justify-center items-center flex-col'>
      <div className='flex'>
      <img alt='dollar_coin' src={dollar_coin} className='mb-8' style={{height: '40px', width: '40px',position:'relative',top:'0px',left: '0px'}}></img>
      <p className='text-4xl ml-2'>{coin}</p>
      </div>
        <h1 className='text-3xl'>{`Task ${taskNumber}`}</h1>
        <input className='text-black border-3 border-green-600 rounded-lg m-4 p-2' placeholder='Enter Code'></input>
        <button className='bg-blue-600 p-2 rounded-lg shadow-10 shadow-y-white'>Verify</button>
    </div>

</>
  )
}
export default TaskVerify
