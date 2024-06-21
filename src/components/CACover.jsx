import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import MyAvatar from './MyAvatar';

const CACover = () => {
    const { currentUser } = useContext(AuthContext);
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-center bg-[url("https://www.transparenttextures.com/patterns/asfalt-light.png")]'>
            <MyAvatar src={currentUser.photoURL} width={'200px'} height={'200px'} />
            <p className='text-3xl'>Hay <span className='font-bold text-[#86C232]'>{currentUser.displayName}</span></p>
            <p className='text-sm'>You can search for other people in the app to chat</p>
            <p className='text-xs'>Just try it out using search bar</p>
        </div>
    );
}

export default CACover;