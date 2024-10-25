import React, { useState, useEffect, useContext } from 'react';
import './components.css';
import { UserContext, UserProvider } from '../UserContext';
// import { update } from 'firebase/database';


function FarmingBox({onClaim, levelUpdate}) {
    const [points, setPoints] = useState(0); //useState(1200);
    const [totalPoints, setTotalPoints] = useState(0);
    const [farming, setFarming] = useState(true);
    const [claimed, setClaimed] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const duration = 2//60*60*8+1200; // 180 minutes in seconds
    const increment = 1;

    const {updateCoins} = useContext(UserContext);
  
    useEffect(() => {
      let interval = null;
      if (!farming && points < duration && !loading) {
        interval = setInterval(() => {
          setPoints((prev) => Math.min(prev + increment, duration));
        }, 1000); // Increase points every second
      } else if (points >= duration) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [farming, points, loading]);
  
    const handleClick = () => {
      setFarming(false);
    };
  
    const handleClaim = () => {
      setLoading(true); // Start loading
      setTotalPoints(totalPoints + points);
      
      setClaimed(false); // Reset claimed state for new claim
  
      // Simulate loading for 5 seconds
      setTimeout(() => {
        setLoading(false); // End loading
        setClaimed(true); // Indicate that points have been claimed
        setFarming(true); // Reset farming state to allow new farming
        updateCoins(20);//update Coin
        //updateCoin(0,3);// Update Level
      }, 500); // 5 seconds
      setPoints(0);
    };

  return (
    <UserProvider>
    <div className="flex flex-col items-center justify-center">
        
      <div className="rounded-lg bg-white w-96 h-16 border border-gray-400 relative">
      
        {farming ? (
          <div
            onClick={handleClick}
            className="w-full h-full bg-green-500 flex items-center justify-center cursor-pointer"
          >
            <p className="text-gray-200 text-xl font-bold">Farming</p>
          </div>
        ) : points >= duration ? (
          <div
            onClick={handleClaim}
            className="w-full h-full bg-blue-500 flex items-center justify-center cursor-pointer"
          >
            <p className="text-xl text-white font-bold">Claim 20</p>
          </div>
        ) : (
          <div
            className="rounded-lg h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${(points / duration) * 100}%` }}
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

{(!farming && points!==duration && !loading)?<p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-blue-900'>8 hour Counting...</p>:""}
      </div>
      <div className="mt-4">
        <p className="text-xl font-bold">
          {farming?0:points}/{duration}
        </p>
      </div>
    </div>
    </UserProvider>
  );
}

export default FarmingBox;
