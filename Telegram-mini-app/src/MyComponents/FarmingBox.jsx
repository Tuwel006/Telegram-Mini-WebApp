import React, { useState, useContext, useEffect } from 'react';
import './components.css';
//import { UserContext, UserProvider } from '../UserContext';
import axios from 'axios';
// import { update } from 'firebase/database';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import Cookies from 'js-cookie';
import {database} from '../firebase.js';
import { UserContext } from '../UserContext.js';



function FarmingBox({onClaim, levelUpdate}) {
    const [points, setPoints] = useState(0); //useState(1200);
    const [totalPoints, setTotalPoints] = useState(0);
    const [loading, setLoading] = useState(false); // New loading state
    const duration = 10;//60*60*8+1200; // 180 minutes in seconds
    //const [farmingPoint, setfarmingPoint] = useState(0);
    //const [isFarming, setisFarming] = useState(null);

    const {farmingPoint, isFarming, updateCoins} = useContext(UserContext);
const telegramID = Cookies.get("authToken");
    const startFarming = async () => {
      if(telegramID) {
        try {
          await axios.post(`${process.env.REACT_APP_SERVER_URL}start-farming`, { telegramID });
        } catch (error) {
          console.error('Error starting farming:', error);
        }
      }
      else{
        console.log("User Not Authinticate");
      }
    }
  
    const claimCoins = async () => {
      try {
        const points = 150;
        await axios.post(`${process.env.REACT_APP_SERVER_URL}points-claim`, { telegramID, points });
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
    <div className="flex flex-col items-center justify-center">
        
      <div className="rounded-lg bg-white w-96 h-16 border border-gray-400 relative">
      
        {(!isFarming&&!loading && farmingPoint<duration)? (
          <div
            onClick={startFarming}
            className="w-full h-full bg-green-500 flex items-center justify-center cursor-pointer"
          >
            <p className="text-gray-200 text-xl font-bold">Farming</p>
          </div>
        ) : (farmingPoint >= duration )? (
          <div
            onClick={claimCoins}
            className="w-full h-full bg-blue-500 flex items-center justify-center cursor-pointer"
          >
            <p className="text-xl text-white font-bold">Claim {farmingPoint}</p>
          </div>
        ) : (
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{borderRadius:`${100/farmingPoint}%`, width: `${(farmingPoint / duration) * 100}%` }}
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

{(isFarming && farmingPoint!==duration && !loading)?<p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-blue-900 text-xl'>{farmingPoint?(farmingPoint):''}</p>:""}
      </div>
      
    </div>
      <Link className='mt-2 mx-8 border-2 border-white h-5 w-5 bg-blue-800 p-1 rounded-xl text-white' to={'/game'}>GAME</Link>
    </>
  );
}

export default FarmingBox;
