import React from 'react'
import homeBtn_logo from '../icon/homeBtn_logo.png';
import withdraw_logo from '../icon/withdra_logo.png';
import airDropBtn_logo from '../icon/airDropBtn_logo.png';
import guide_logo from '../icon/guide_logo.png';
import level_logo from '../icon/level_logo.png';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <>
    <div style={{height: '105px'}} className=' px-2 pb-2 flex justify-between items-start bg-slate-900 text-light w-88 rounded-tl-3xl rounded-tr-3xl overflow-hidden'>
    <Link to={'/airdrop'} className='bg-slate-900 hover:bg-slate-700 active:bg-slate-700 focus:outline-none focus:ring focus:ring-violet-300 ... cursor-pointer pt-1 flex flex-col items-center'>
    <img alt='airDropBtn_logo' src={airDropBtn_logo} className='' style={{height: '47px', width: '47px'}}></img>
    <p>Airdrop</p>
    </Link>
    <Link to={'/guide'} className='bg-slate-900 hover:bg-slate-700 active:bg-slate-700 focus:outline-none focus:ring focus:ring-violet-300 ... cursor-pointer pt-1 flex flex-col items-center'>
    <img alt='guid_logo' src={guide_logo} className='' style={{height: '47px', width: '47px'}}></img>
    <p>Guide</p>
    </Link>
    <Link to={'/'} className='bg-slate-900 hover:bg-slate-700 active:bg-slate-700 focus:outline-none focus:ring focus:ring-violet-300 ... cursor-pointer flex flex-col items-center'>
    <img alt='homeBtn_logo' src={homeBtn_logo} className='' style={{height: '65px', width: '65px'}}></img>
    <p>Home</p>
    </Link>
    <Link to={'/level'} className='bg-slate-900 hover:bg-slate-700 active:bg-slate-700 focus:outline-none focus:ring focus:ring-violet-300 ... cursor-pointer pt-1 flex flex-col items-center'>
    <img alt='level_logo' src={level_logo} className='' style={{height: '47px', width: '47px'}}></img>
    <p>Level</p>
    </Link>
    <Link to={'/widthdraw'} className='bg-slate-900 hover:bg-slate-700 active:bg-slate-700 focus:outline-none focus:ring focus:ring-violet-300 ... cursor-pointer pt-1 flex flex-col items-center'>
    <img alt='withdraw_logo' src={withdraw_logo} className='border-blue-600 border-2 rounded-full' style={{height: '47px', width: '47px'}}></img>
    <p>Widthdraw</p>
    </Link>
    </div>
    </>
  )
}

