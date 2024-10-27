import React, { useState, useEffect, useContext } from 'react';
import './components.css';
import { UserContext, UserProvider } from '../UserContext';
import axios from 'axios';
// import { update } from 'firebase/database';
import { Link } from 'react-router-dom';


function FarmingBox({onClaim, levelUpdate}) {
    const [points, setPoints] = useState(0); //useState(1200);
    const [totalPoints, setTotalPoints] = useState(0);
    const [farming, setFarming] = useState(true);
    const [claimed, setClaimed] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const duration = 50;//60*60*8+1200; // 180 minutes in seconds
    const increment = 1;
    const [farmingPoints, setFarmingpoints] = useState(0);
    const [farmingStatus, setFarmingStatus] = useState(null);

    const {updateCoins,telegramID} = useContext(UserContext);

    const startFarming = async () => {
      if(telegramID) {
        try {
          await axios.post(`http://localhost:5000/startClaim`,{telegramID});
        } catch (error) {
          console.log(error);
        }
      }
    }

    const stopFarming = async () => {
     // console.log("Farming stop Called: "+telegramID);
      if(telegramID) {
        try {
          await axios.post(`http://localhost:5000/stopClaim`,{telegramID});
        } catch (error) {
          console.log(error);
        }
      }
    }

    const getFarmingPoints = async ()=> {
        try {
          //console.log("Get poin running: "+farmingPoints+"  React Fault: "+farmingPoints+" FARMING STATUS: "+farmingStatus);
          const res = await axios.get(`http://localhost:5000/liveFarmingPoints/${telegramID}`,{telegramID});
          const {newFP, newFarmingStatus} = res.data;
          setFarmingpoints(newFP);
          setFarmingStatus(newFarmingStatus);
          //return newFP;
        } catch (error) {
          console.log(error);
        }
            
    }
    getFarmingPoints();

  

  
    const handleClick = () => {
       startFarming();
       if(!farmingStatus) {
        window.location.reload();
       }     
    };
  
    const handleClaim = () => {
      stopFarming();
      setLoading(true); // Start loading
      setTotalPoints(totalPoints + points);
      
      setClaimed(false); // Reset claimed state for new claim
  
      // Simulate loading for 5 seconds
      setTimeout(() => {
        setLoading(false); // End loading
        setClaimed(true); // Indicate that points have been claimed
        setFarming(true); // Reset farming state to allow new farming
        if(farmingStatus){
          updateCoins(farmingPoints);
        }
        else{
          window.location.reload();
          return;
        }
        if(farmingStatus) {
          window.location.reload();
        }
        //update Coin
        //updateCoin(0,3);// Update Level
      }, 500); // 5 seconds
      setPoints(0);
    };

  return (
    <UserProvider>
    <div className="flex flex-col items-center justify-center">
        
      <div className="rounded-lg bg-white w-96 h-16 border border-gray-400 relative">
      
        {(!farmingStatus&&!loading)? (
          <div
            onClick={handleClick}
            className="w-full h-full bg-green-500 flex items-center justify-center cursor-pointer"
          >
            <p className="text-gray-200 text-xl font-bold">Farming</p>
          </div>
        ) : farmingPoints >= duration ? (
          <div
            onClick={handleClaim}
            className="w-full h-full bg-blue-500 flex items-center justify-center cursor-pointer"
          >
            <p className="text-xl text-white font-bold">Claim {farmingPoints}</p>
          </div>
        ) : (
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{borderRadius:`${100/farmingPoints}%`, width: `${(farmingPoints / duration) * 100}%` }}
          ></div>
        )}

{loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <p className="text-yellow-600 font-bold">Loading...</p>
            <div className="loader"> {/* Simple loader styling */} 
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          </div>
        )}

{(farmingStatus && farmingPoints!==duration && !loading)?<p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-blue-900 text-xl'>{farmingPoints?(farmingPoints.toFixed(3)):''}</p>:""}
      </div>
      
    </div>
    <div className="flex justify-center  mt-4">
        <p className="text-xl font-bold">
          {farmingPoints.toFixed(3)} / {20}
        </p>
      </div>
      <Link className='border-2 border-white h-5 w-5 bg-blue-800 p-1 rounded-xl text-white' to={'/game'}>GAME</Link>
    </UserProvider>
  );
}

export default FarmingBox;
