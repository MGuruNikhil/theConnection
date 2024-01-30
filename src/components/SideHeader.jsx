import React, { useContext } from 'react'
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';

const SideHeader = () => {
    const {currentUser} = useContext(AuthContext);
    const displayName = currentUser.displayName;
    const photoURL = currentUser.photoURL;

    return (
        <div className="SideHeader max-h-[56px] flex flex-row p-2 justify-between bg-[#61892F] overflow-hidden">
            <img src={photoURL} alt="pp" width={'40px'} height={'40px'} className='rounded-[50%] object-cover'/>
            <p className='self-center'>{displayName}</p>
            <button onClick={()=>signOut(auth)} className='h-[40px] px-1 py-2 text-center'>Log Out</button>
        </div>
    );
}

export default SideHeader;