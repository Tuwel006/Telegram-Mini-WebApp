import React, { useState, useContext } from 'react';
import './components.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from '../UserContext.js';

function FarmingBox({ onClaim, levelUpdate }) {
    const [loading, setLoading] = useState(false);
    const duration = 1000; 
    const { farmingPoint, isFarming } = useContext(UserContext);
    const telegramID = Cookies.get("authToken");

    const startFarming = async () => {
      if (telegramID) {
        setLoading(true);
        try {
          // Set a fallback timeout to stop loading if the request takes too long
          await Promise.race([
            axios.post(`${process.env.REACT_APP_SERVER_URL}start-farming`, { telegramID }),
            new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1-second delay
          ]);
        } catch (error) {
          console.error('Error starting farming:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User Not Authenticated");
      }
    };

    const claimCoins = async () => {
      setLoading(true);
      try {
        const points = 150;
        await Promise.race([
          axios.post(`${process.env.REACT_APP_SERVER_URL}points-claim`, { telegramID, points }),
          new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1-second delay
        ]);
      } catch (error) {
        console.log('Error claiming coins:', error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-lg bg-white w-96 h-16 border border-gray-400 relative">
          
          {(!isFarming && !loading && farmingPoint < duration) ? (
            <div
              onMouseDown={startFarming} onTouchStart={startFarming} // Handles touch on mobile
              className="w-full h-full bg-green-500 flex items-center justify-center cursor-pointer"
            >
              <p className="text-gray-200 text-xl font-bold">Farming</p>
            </div>
          ) : (farmingPoint >= duration) ? (
            <div
              onMouseDown={claimCoins} onTouchStart={claimCoins} // Handles touch on mobile
              className="w-full h-full bg-blue-500 flex items-center justify-center cursor-pointer"
            >
              <p className="text-xl text-white font-bold">Claim {farmingPoint}</p>
            </div>
          ) : (
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ borderRadius: `${100 / farmingPoint}%`, width: `${(farmingPoint / duration) * 100}%` }}
            ></div>
          )}

          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <p className="text-yellow-600 font-bold">Loading...</p>
              <div className="loader">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            </div>
          )}

          {(isFarming && farmingPoint !== duration && !loading) && (
            <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-blue-900 text-xl'>
              {farmingPoint ? farmingPoint : ''}
            </p>
          )}
        </div>
      </div>
      
    </>
  );
}

export default FarmingBox;
