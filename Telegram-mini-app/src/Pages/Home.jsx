import React, { useContext } from 'react';
import Main from '../MyComponents/Main';
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