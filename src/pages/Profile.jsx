import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logOutIcon from '../assets/logout.png';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import EditableComp from "../components/EditableComps";

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
        <div className="p-16 bg-[#474B4F] flex flex-col items-center w-[50%] h-full m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <img src={currentUser.photoURL} className='rounded-full w-[200px] h-[200px] object-cover'  alt="pp" />
            <EditableComp label="Display Name" value={currentUser.displayName} fbkey="displayName" />
            <EditableComp label="Email id" value={currentUser.email} fbkey="email" />
            <EditableComp label="Phone Number" value={currentUser.phoneNumber||"-"} fbkey="phoneNumber" />
            <div className="flex flex-row gap-2">
                <button onClick={handleLogout} className='gap-2 border border-transparent text-base font-semibold font-inherit cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232] h-[40px] px-2 py-4 bg-inherit rounded-full focus:outline-none flex items-center justify-center'>
                    <img src={logOutIcon} width={20} height={20} alt="log out" />
                    Log Out
                </button>
            </div>
        </div>
    )
}

export default Profile;