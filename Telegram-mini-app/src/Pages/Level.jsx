import React, {useState, useContext} from 'react'
import Footer from '../MyComponents/Footer'
import Main from '../MyComponents/Main'
import opendLock from '../icon/opendLock.png'
import openingLock from '../icon/openingLock.png'
import closeLock from '../icon/closeLock.png'
import dollar_sign from '../icon/dolar_sign.png'
import { UserContext, UserProvider } from '../UserContext';
import { Link } from 'react-router-dom';
import axios from 'axios'

export default function Level() {
  const {updateBalance, updateLevelCheck} = useContext(UserContext);
  const user = useContext(UserContext);
    const [dollarLeval, setDollarLevel] = useState(0);
    const [loadingStates, setLoadingStates] = useState(Array(100).fill(false));
    let value;


    const handleLevelClaim = async (idx) => {
      const newLoadingStates = [...loadingStates];
      newLoadingStates[idx] = true; // Set the clicked button to loading state
      setLoadingStates(newLoadingStates);
     const telegramID = user.telegramID;
            //val = parseFloat(val.toFixed(2));
      if(!user.levelReward[idx] && telegramID) {
         axios.post(`${process.env.REACT_APP_SERVER_URL}levelReward-claim`,{idx, telegramID});
         await new Promise(resolve => setTimeout(resolve, 500));
      }
      const updatedLoadingStates = [...loadingStates];
      updatedLoadingStates[idx] = false; // Reset the loading state
      setLoadingStates(updatedLoadingStates); // Update state to reflect the change
    }
  return (
    <UserProvider>
        <div>
          <p className='text-3xl'>Level:</p>
          <p className='flex text-xl  mt-2 mb-2'>Earn 
          <img alt='dollar_sign' src={dollar_sign} className='' style={{height: '35px', width: '40px',position:'relative',top:'0px',left: '0px'}}></img><p className='text-yellow-400 text-2xl mr-2'>12.75</p> Complete 50 Levels.
          </p>
        </div>
      <main className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-5 p-1 gap-1">
          {loadingStates.map((loading, index) => (
            //isDisabled = index >= 9,
            value = (index+1)*0.01,
            value = parseFloat(value.toFixed(10)),
            <button
              key={index}
              className={`relative rounded-xl bg-green-600 h-20 flex flex-col items-center text-white font-bold ${(index+1>user.level) ? 'bg-gray-500 text-gray-300 opacity-50':(user.level>=index+1 && user.levelReward[index]===false)? 'bg-blue-400 text-white border-2 border-yellow-500 animate-pulse' : 'disabled-true bg-blue-500 text-white'}`}
              onClick={()=>handleLevelClaim(index)}
            >
              <p>{`Level ${index + 1}`}</p>
              <p className='text-yellow-400'>${value}</p>
              {(index+1<=user.level && user.levelReward[index]===true)?<img alt='opendLock' src={opendLock} className='' style={{height: '35px', width: '40px',position:'relative',top:'-3px',left: '0px'}}></img>
              :(user.level>index+1 && !user.levelReward[index]) ?<img alt='openingLock' src={openingLock} className='' style={{height: '35px', width: '40px',position:'relative',top:'-3px',left: '0px'}}></img>              
              :<img alt='closeLock' src={closeLock} className='' style={{height: '35px', width: '40px',position:'relative',top:'-3px',left: '0px'}}></img>}
              {loading && index+1<=user.level && user.levelReward[index]===true && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
            </button>
          ))}
        </div>
      </main>
    </UserProvider>
  )
}