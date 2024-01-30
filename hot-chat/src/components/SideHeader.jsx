import React from 'react'
import Dummy from '../assets/Dummy.jpg'

const SideHeader = () => {
    return (
        <div className="SideHeader flex flex-row p-2 justify-between border-b-2 border-b-black border-solid bg-[#61892F] overflow-hidden">
            <img src={Dummy} alt="pp" width={'35px'} height={'35px'} className='rounded-[50%] object-cover'/>
            <p className='self-center'>Display Name</p>
            <button id='logout'>Log out</button>
        </div>
    );
}

export default SideHeader;