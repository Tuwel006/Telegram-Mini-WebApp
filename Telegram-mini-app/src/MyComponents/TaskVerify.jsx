import React from 'react'

const TaskVerify = ({taskNumber}) => {
  return (
    <div className='h-full w-full flex justify-center items-center flex-col'>
        <h1 className='text-3xl'>{`Task ${taskNumber}`}</h1>
        <input className='text-black border-3 border-green-600 rounded-lg m-4 p-2' placeholder='Enter Code'></input>
        <button className='bg-blue-600 p-2 rounded-lg shadow-10 shadow-y-white'>Verify</button>
    </div>
  )
}
export default TaskVerify
