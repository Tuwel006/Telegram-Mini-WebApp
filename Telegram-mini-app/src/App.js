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
  const postData = useCallback( async (telegramID, userName) => {
    if(telegramID && userName && !user) {
      try {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}initialize-user/${telegramID}/${userName}`, {userName,telegramID});
      } catch (error) {
        console.log("ERROR in START TIMER: "+error);
      }
    }
  },[user])


    useEffect(() => {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const telegramID = urlParams.get('telegramID') || "Test";
      const fn = urlParams.get('fn');
      const ln = urlParams.get('ln');
      let userName;
      if(fn) {
        userName+=fn;
      }
      if(ln){
        userName+=" "+ln;
      }
      if(!fn&&!ln){
        userName+="Your Name";
      }
      const token = urlParams.get('token');
      //setShowOverlay(checkIn.collect);
      if(window.location.reload){
        axios.post(`${process.env.REACT_APP_SERVER_URL}checkIn`, {telegramID, userName});
      }

      if (telegramID && userName) {
        // Save token in a cookie
        Cookies.set('authToken', telegramID, { expires: 45, sameSite: 'None', secure: true });
  
        // Save Telegram ID, username, and token to Firebase
        postData(telegramID, userName, token);
      }
      setLoading(false);
      //console.log("Cookies: "+Cookies.get('authToken'));
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
