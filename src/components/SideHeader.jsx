import React, { useContext } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import logOutIcon from '../assets/logout.png';
import profileEdit from "../assets/profileEdit.png"
import { useNavigate } from 'react-router-dom';

const SideHeader = () => {
    const { currentUser } = useContext(AuthContext);
    const displayName = currentUser.displayName;
    const photoURL = currentUser.photoURL;
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to log out ?');
        if (confirmLogout) {
            signOut(auth)
            .then(() => {
                console.log('User logged out successfully');
            })
            .catch((error) => {
                console.error('Error during logout:', error);
            });
        }
    };

    return (
        <div className="SideHeader max-h-[56px] flex flex-row p-2 justify-between bg-[#61892F] overflow-hidden">
            <img src={photoURL} alt="pp" width={'40px'} height={'40px'} className='rounded-[50%] object-cover hover:border-[1px] hover:border-solid hover:border-[#86C232] cursor-pointer' />
            <p className='self-center'>{displayName}</p>
            <div className='flex flex-row gap-2'>
                <button onClick={()=>{navigate("/profile")}} className='border border-transparent text-base font-semibold font-inherit cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232] h-[40px] w-[40px] px-1 py-2 bg-inherit rounded-full focus:outline-none flex items-center justify-center'>
                    <img src={profileEdit} width={20} height={20} alt="log out" />
                </button>
                <button onClick={handleLogout} className='border border-transparent text-base font-semibold font-inherit cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232] h-[40px] w-[40px] px-1 py-2 bg-inherit rounded-full focus:outline-none flex items-center justify-center'>
                    <img src={logOutIcon} width={20} height={20} alt="log out" />
                </button>
            </div>
        </div>
    );
};

export default SideHeader;
