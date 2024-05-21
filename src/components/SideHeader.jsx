import React, { useContext } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import BootstrapTooltip from '../materialUI/BootstrapTooltip';

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
        <div className="SideHeader max-h-[56px] flex flex-row p-2 justify-between bg-gradient-to-r from-[#1f7474] to-[#88b430] overflow-hidden">
            <img src={photoURL} alt="pp" width={'40px'} height={'40px'} className='rounded-[50%] object-cover hover:border-[1px] hover:border-solid hover:border-[#86C232] cursor-pointer' />
            <p className='self-center'>{displayName}</p>
            <div className='flex flex-row gap-4'>
                <BootstrapTooltip title="Profile">
                    <button onClick={()=>{navigate("/profile")}}>
                        <PersonIcon className='text-[#000000]'/>
                    </button>
                </BootstrapTooltip>
                <BootstrapTooltip title="log Out">
                    <button onClick={handleLogout}>
                        <LogoutIcon className='text-[#000000]'/>
                    </button>
                </BootstrapTooltip>
            </div>
        </div>
    );
};

export default SideHeader;
