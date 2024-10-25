import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import profile_logo from '../icon/profile_logo.png';
import user_logo from '../icon/user_logo.webp';
import dollar_sign from '../icon/dolar_sign.png';
import { UserProvider, UserContext } from '../UserContext';

export default function Header() {
  const user = useContext(UserContext);
  return (
    <UserProvider>
        <div className="px-2 z-10 bg-black" style={{height: '125px'}}>
          <div className="flex flex-col justify-center space-x-2 pt-2">
            <div className='flex justify-between items-center' style={{height: '38px'}}>
              <p className='text-sm'>X Cancel</p>
              <div className='flex'>
              <img alt='user-logo' src={profile_logo} className='' style={{height: '45px', width: '45px'}}></img>
              <p className='' style={{color: '#5966ff',fontSize: '20px'}}>Tarbo Coin</p>
              </div>
              <p>=</p>
            </div>
            <div className="p-1 rounded-lg bg-[#1d2025]">

            </div>
            <div className='mt-1 flex justify-between mb-2'>
            <div className='flex'>
            <div style={{borderRadius:'50%', marginRight:'2px'}} className='rounded-full border border-2 border-red-200'>
            <img alt='user_logo' src={user_logo} className='' style={{height: '25px', width: '25px'}}></img>
            </div>
              <p className=" pt-1 text-2x1">{user?user.name:""}</p>
            </div>
            <div className='px-1 flex justify-self-end bg-zinc-800 mt-1 rounded-xl'>
            <img alt='dollar_sign' src={dollar_sign} className='' style={{height: '18px', width: '18px',position:'relative',top:'4px'}}></img>
              <p>{user?user.balance:0}</p></div>
          </div>
          
            </div>
          
        </div>
    </UserProvider>
  )

}

Header.defaultProps = {
    name: "Username",
}
Header.prototypes = {
    name: PropTypes.string,
}