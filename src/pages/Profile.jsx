import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logOutIcon from '../assets/logout.png';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Profile = () => {

    const { currentUser } = useContext(AuthContext);

    console.log(currentUser);

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
        <div className="p-20 bg-[#474B4F] flex flex-col items-center space-y-5 max-w-fit m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <img src={currentUser.photoURL} className='rounded-[50%] w-[100px] h-[100px] object-cover'  alt="pp" />
            <h2 className='text-[1.6em] text-[#61892F]'>{currentUser.displayName}</h2>
            <p>Email id : {currentUser.email}</p>
            <p>Phone Number : {currentUser.phoneNumber||"-"}</p>
            <div className="flex flex-row gap-2">
                <button onClick={handleLogout} className='border border-transparent text-base font-semibold font-inherit cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232] h-[40px] w-[40px] px-1 py-2 bg-inherit rounded-full focus:outline-none flex items-center justify-center'>
                    <img src={logOutIcon} width={20} height={20} alt="log out" />
                </button>
            </div>
        </div>
    )
}

export default Profile;