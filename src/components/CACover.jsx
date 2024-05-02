import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

const CACover = () => {
    const {currentUser} = useContext(AuthContext);
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <img src={currentUser.photoURL} className='rounded-[50%] w-[200px] h-[200px] object-cover'  alt="pp" />
            <p className='text-3xl'>Hay <span className='font-bold text-[#86C232]'>{currentUser.displayName}</span></p>
            <p className='text-sm'>You can search for other people in the app to chat</p>
            <p className='text-xs'>Just try it out using search bar</p>
            <button>Change DB</button>
        </div>
    );
}

export default CACover;