// UserContext.js
import React, { createContext, useEffect, useState } from 'react';
import { database } from './firebase'; // Import Firebase configuration
import { ref, onValue, runTransaction, get, set, push, update } from 'firebase/database';
import Cookies from 'js-cookie'

// Create User Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => { // Fix: Destructure children correctly
  const [coin, setCoins] = useState(0);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [levelPoints, setLevelPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(100);
  const [levelReward, setLevelReward] = useState([]);

  // Retrieve telegramID from the URL parameters
  const telegramID = Cookies.get('authToken') || new URLSearchParams(window.location.search).get('telegramID');

  useEffect(() => {


    if (!telegramID) {
      return;
    } // Ensure telegramID is available

    if(!Cookies.get('authToken')){
      if(telegramID){
        Cookies.set('authToken', telegramID, { expires: 45, sameSite: 'None', secure: true });
      }
    }

    const userRef = ref(database, `UserDb/${telegramID}`);
    const coinRef = ref(database, `UserDb/${telegramID}/coin`);
    const balanceRef = ref(database, `UserDb/${telegramID}/balance`);
    const nameRef = ref(database, `UserDb/${telegramID}/name`);
    const levelRef = ref(database, `UserDb/${telegramID}/level`);
    const levelPointsRef = ref(database, `UserDb/${telegramID}/levelPoints`);
    const maxPointsRef = ref(database, `UserDb/${telegramID}/maxPoints`);
    const levelRewardRef = ref(database, `UserDb/${telegramID}/levelReward`);


    // Set up real-time listeners
    const unsubscribeCoin = onValue(coinRef, (snapshot) => {
      setCoins(snapshot.val() || 0);
    });

    const unsubscribeBalance = onValue(balanceRef, (snapshot) => {
      setBalance(snapshot.val() || 0);
    });

    const unsubscribeName = onValue(nameRef, (snapshot) => {
      setName(snapshot.val() || "");
    });

    const unsubscribeLevel = onValue(levelRef, (snapshot) => {
      setLevel(snapshot.val() || 1);
    });

    const unsubscribeLevelPoints = onValue(levelPointsRef, (snapshot) => {
      setLevelPoints(snapshot.val() || 0);
    });
    const unsubscribemaxPoints = onValue(maxPointsRef, (snapshot) => {
      setMaxPoints(snapshot.val() || 0);
    });
    const unsubscribeLevelReward = onValue(levelRewardRef, (snapshot) => {
      setLevelReward(snapshot.val() || 0);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeCoin();
      unsubscribeBalance();
      unsubscribeName();
      unsubscribeLevel();
      unsubscribeLevelPoints();
      unsubscribemaxPoints();
      unsubscribeLevelReward();
    };
  }, [telegramID]); // Add telegramID to the dependency array
  
  const updateBalance = async (addBalance) => {
    const balanceRef = ref(database, `UserDb/${telegramID}/balance`);
    runTransaction(balanceRef, (currBalance) => {
      return (currBalance || 0) + addBalance;
    })

  }

  const updateLevelCheck = async (index) => {
    const updatelevelRewardRef = ref(database, `UserDb/${telegramID}/levelReward/${index}`);
    set(updatelevelRewardRef,false)
  }

  const updateCoins = async (addCoin) => {
    
    if (!telegramID) return;
    const coinRef = ref(database, `UserDb/${telegramID}/coin`);
    const levelPointsRef = ref(database, `UserDb/${telegramID}/levelPoints`);
    const levelRef = ref(database, `UserDb/${telegramID}/level`);
    const maxPointsRef = ref(database, `UserDb/${telegramID}/maxPoints`);

    const coinVal = (await get(coinRef)).val();
    runTransaction(coinRef, (currentCoins) => {
      return (currentCoins || 0) + addCoin;
    });
    
    const levelPointsVal = (await get(levelPointsRef)).val();
    const maxPointsVal = (await get(maxPointsRef)).val();
    if(levelPointsVal+addCoin>maxPointsVal) {
      runTransaction(levelPointsRef, (currLevelPoints) => {
        return (currLevelPoints || 0) + addCoin - maxPointsVal;
      })
      let levelVal;
      runTransaction(levelRef, (currLevel) => {
        const levelRewardRef = ref(database, `UserDb/${telegramID}/levelReward/${currLevel-1}`);

        levelVal = currLevel;
        set(levelRewardRef,true);
        return currLevel+1;
      })
      runTransaction(maxPointsRef, (currMaxPoints) => {
        return currMaxPoints+levelVal*10;
      })
    }
    else{
      runTransaction(levelPointsRef, (currLevelPoints) => {
        return (currLevelPoints || 0) + addCoin;
        
      })
    }
  //   const nameRef = ref(database, `UserDb/${telegramID}/name`);
  //   runTransaction(nameRef, async (name) => {
  //     return (await get(nameRef).val())
  // })
    
  };

  const updateTimeLeft = () => {
    const timeLeftRef = ref(database, `UserDb/${telegramID}/timeLeft`);

    const interValTime = setInterval(()=>{
      runTransaction(timeLeftRef, (currTimeLeft) => {
        if(currTimeLeft<=1) {
          clearInterval(interValTime);
        }
        return currTimeLeft-1000;
      })
    },1000);

  }

  const contextValue = {
    coin,
    balance,
    name,
    level,
    levelPoints,
    maxPoints,
    levelReward,
    updateCoins,
    updateBalance,
    updateLevelCheck,
    updateTimeLeft,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

