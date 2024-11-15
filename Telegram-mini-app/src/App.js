import './App.css';
import Home from './Pages/Home';
import Widthdraw from './Pages/Widthdraw';
import Level from './Pages/Level';
import Guide from './Pages/Guide';
import Referral from './Pages/Referral';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContext, UserProvider } from './UserContext';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Header from './MyComponents/Header';
import Footer from './MyComponents/Footer';
import Task from './Pages/Task';
import Cookies from 'js-cookie';
import axios from 'axios';
import Game from './Pages/Game';
import DailyReward from './Pages/DailyReward';


function App() {
  const [loading, setLoading] = useState(true);
  const user = useContext(UserContext);
  const postData = useCallback(async (telegramID, userName) => {
    if (telegramID && userName && !user) {
      console.log("Making request with:", {
        url: `${process.env.REACT_APP_SERVER_URL}initialize-user/${telegramID}/${userName}`,
        data: { telegramID, userName },
      });
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}initialize-user/${telegramID}/${userName}`
        );
        console.log("Response from server:", response.data);
      } catch (error) {
        console.error("Error during request:", error.message);
      }
    }
  }, [user]);
  


  useEffect(() => {
    const initialize = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const telegramID = urlParams.get('telegramID') || "Test";
      const fn = urlParams.get('fn');
      const ln = urlParams.get('ln');
      let userName = '';
  
      if (fn) userName += fn;
      if (ln) userName += " " + ln;
      if (!fn && !ln) userName += "Your Name";
  
      const token = urlParams.get('token');
  
      if (telegramID && userName) {
        // Save token in a cookie
        Cookies.set('authToken', telegramID, { expires: 45, sameSite: 'None', secure: true });
  
        // Save Telegram ID, username, and token to Firebase
        await postData(telegramID, userName, token);
      }
      setLoading(false);
    };
  
    initialize();
  }, [postData]);
  



  return (
      <UserProvider>
        <Router>
      <div className="bg-white flex justify-center">
        <div className={`w-full bg-gray-800 text-white h-screen font-bold flex flex-col max-w-xl ${loading? 'loading':''}`}>
          <Header/>
          <Routes>
          <Route path='/game' element={<Game/>}/>
            <Route path="/" element={<Home/>} />
            <Route path="/widthdraw" element={<Widthdraw/>} />
            <Route path="/level" element={<Level/>} />
            <Route path="/Referral" element={<Referral/>} />
            <Route path="/guide" element={<Guide/>} />
            <Route path="/Task" element={<Task/>} />
            <Route path="/dailyReward" element={<DailyReward/>} />

          </Routes>
          <Footer/>
        </div>
      </div>
    </Router>
      </UserProvider>

    
  );
}

export default App;
