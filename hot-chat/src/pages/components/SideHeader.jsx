import React from 'react'
import Dummy from './Dummy.jpg'

const SideHeader = () => {
    return (
        <div className="SideHeader flex flex-row p-2 justify-between border-b-2 border-b-black border-solid bg-rose-600 overflow-hidden">
            <img src={Dummy} alt="pp" width={'35px'} height={'35px'} className='rounded-full object-cover'/>
            <p className='self-center text-rose-950'>Display Name</p>
            <button id='logout'>Log out</button>
        </div>
    );
}

export default SideHeader;