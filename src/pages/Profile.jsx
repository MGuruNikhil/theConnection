import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logOutIcon from '../assets/logout.png';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import EditableComp from "../components/EditableComps";
import Back from "../assets/arrow.png";
import Edit from "../assets/edit.png";
import { useNavigate } from "react-router-dom";

const Profile = () => {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

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
        <div className="min-w-[350px] relative bg-[#474B4F] flex flex-col justify-center items-center w-[50%] h-full m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <button onClick={()=>{navigate("/")}} className="absolute top-2 left-2 z-10 bg-[#86C232] rounded-full cursor-pointer p-2 flex items-center justify-center"><img src={Back} width={20} height={20} alt="log out" /></button>
            <div className="relative">
                <img src={currentUser.photoURL} className='rounded-full w-[200px] h-[200px] object-cover'  alt="pp" />
                <button className="absolute bottom-2 right-2 z-10 bg-[#86C232] rounded-full cursor-pointer p-2 flex items-center justify-center"><img src={Edit} width={30} height={30} alt="edit" /></button>
            </div>
            <EditableComp label="Display Name" fbkey="displayName" />
            <div className="flex items-center w-[70%] p-2 h-[50px]">
                <p className="flex-shrink-0 inline-block whitespace-no-wrap text-[#ffffff] text-semibold">Email :</p>
                <span className="grow text-[#86C232] text-bold">{currentUser.email}</span>
            </div>
            {/* <EditableComp label="Email id" fbkey="email" /> */}
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