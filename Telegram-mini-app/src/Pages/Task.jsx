import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TaskVerify from '../MyComponents/TaskVerify';

export default function Task() {
    const [selectedTask, setSelectedTask] = useState(null);
    //const navigate = useNavigate();
    //let isTask = false;
    let link = window.location.href;
    console.log("LINK: "+link);
    const handleTaskOpen = (index) => {
        window.open('https://google.com');
        setSelectedTask(index+1);
    }

  return (
    <>
       {selectedTask? <TaskVerify taskNumber = {selectedTask}/>

            :<div className='flex-grow overflow-y-auto h-100 w-100 px-2'>
        <div className="grid grid-col">
            {Array.from({length: 100}).map((_, index) => (
                <button key={index} onClick={()=> {handleTaskOpen(index)}} className='h-14 w-full bg-slate-400 my-2 flex justify-between items-center text-xl px-2 rounded-xl'>
                    <p>Task: {index+1}</p>
                    <p>{'>'}</p>
                </button>
            ))}
        </div>
    </div>

    }
    </>
  )
}
