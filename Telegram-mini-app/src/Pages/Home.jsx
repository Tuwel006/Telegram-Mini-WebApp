import React, { useEffect, useContext } from 'react';
import Header from '../MyComponents/Header';
import Main from '../MyComponents/Main';
import Footer from '../MyComponents/Footer';
import { UserContext } from '../UserContext';
import Overlay from '../MyComponents/Overlay';

// import React, { useState } from 'react';
function Home() {
  const { checkIn } = useContext(UserContext);

  return (
    <>
    {checkIn && !checkIn.collect &&<Overlay />}
    <Main/>
    </>
    
  );
}

export default Home;