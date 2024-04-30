import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import logOutIcon from '../assets/logout.png';
import { auth, storage, db } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import EditableComp from "../components/EditableComps";
import Back from "../assets/arrow.png";
import Edit from "../assets/edit.png";
import Close from "../assets/close.png"
import { useNavigate } from "react-router-dom";

const Profile = () => {

    const { currentUser } = useContext(AuthContext);

    const [showButton, setShowButton] = useState(false);

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

    const handleEditPP = (e) => {
        const photo = e.target.files[0];
        if (photo) {
            const storageRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');
            const uploadTask = uploadBytesResumable(storageRef, photo);
            uploadTask.on(
                (error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage); 
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(currentUser, {
                            photoURL: downloadURL,
                        }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorMessage);
                        });
                        await updateDoc(doc(db, "users", currentUser.uid), {
                            photoURL: downloadURL,
                        }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorMessage);
                        });
                    });
                }
            );
            setShowButton(false);
        }
    }

    const handleRemovePP = async () => {
        deleteObject(ref(storage, 'profilePics/'+currentUser.uid+'.jpg'))
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
        await updateProfile(currentUser, {
            photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
        await updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
        setShowButton(false);
    }

    return (
        <div className="min-w-[350px] relative bg-[#474B4F] flex flex-col justify-center items-center w-[50%] h-full m-auto border-solid border-2 rounded-lg border-[#86C232]">

            <button onClick={() => { navigate("/") }} className="absolute top-2 left-2 z-10 bg-[#86C232] rounded-full cursor-pointer p-2 flex items-center justify-center"><img src={Back} width={20} height={20} alt="log out" /></button>

            <div className="relative">

                <img src={currentUser.photoURL} className='rounded-full w-[200px] h-[200px] object-cover border-2 border-solid border-[#86C232]' alt="pp" />

                <div className="bg-[#474B4F] absolute bottom-2 right-2 z-10 flex gap-2 rounded-full hover:border-2 hover:border-solid hover:border-[#86C232]" onMouseEnter={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)}>
                    {showButton && (
                        <button onClick={handleRemovePP} className="bg-[#6B6E70] rounded-full cursor-pointer p-2 flex items-center justify-center">
                            <img src={Close} width={30} height={30} alt="remove profile picture" />
                        </button>
                    )}
                    <label for="ppUpload" className="bg-[#86C232] rounded-full cursor-pointer p-2 flex items-center justify-center">
                        <img src={Edit} width={30} height={30} alt="edit" />
                    </label>
                </div>

                <input className="hidden" type="file" accept="image/*" id="ppUpload" onChange={handleEditPP} />

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