import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, storage, db } from "../firebase";
import { deleteUser, reauthenticateWithCredential, signOut, updateProfile, EmailAuthProvider } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, getDoc, arrayRemove, deleteDoc } from "firebase/firestore";
import EditDisplayName from "../components/EditDisplayName";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import BootstrapTooltip from "../materialUI/BootstrapTooltip";
import MyAvatar from "../components/MyAvatar";

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
        const fileRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');
        getDownloadURL(fileRef)
            .then(() => {
                deleteObject(fileRef)
                    .then(() => {
                        console.log("File deleted successfully");
                    })
                    .catch((error) => {
                        console.error("Error deleting file:", error);
                    });
            })
            .catch((error) => {
                if (error.code === "storage/object-not-found") {
                    console.log("File does not exist");
                } else {
                    console.error("Error fetching download URL:", error);
                }
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


    const promptForCredentials = () => {
        const email = currentUser.email;
        const password = prompt("To delete your account, enter password : ");
        return EmailAuthProvider.credential(email, password);
    }

    const handleDelAcc = async () => {
        const confirmDelAcc = window.confirm('Are you sure you want to delete your account ?');
        if (confirmDelAcc) {
            const credential = promptForCredentials();

            reauthenticateWithCredential(currentUser, credential).then(async () => {
                const fileRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');

                getDownloadURL(fileRef)
                    .then(() => {
                        // File exists, proceed with deletion
                        deleteObject(fileRef)
                            .then(() => {
                                console.log("File deleted successfully");
                            })
                            .catch((error) => {
                                console.error("Error deleting file:", error);
                            });
                    })
                    .catch((error) => {
                        if (error.code === "storage/object-not-found") {
                            console.log("File does not exist");
                        } else {
                            console.error("Error fetching download URL:", error);
                        }
                    });
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                let chatList;
                if (docSnap.exists()) {
                    chatList = docSnap.data().chatList;
                    if(chatList) {
                        for (let i = 0; i < chatList.length; i++) {
                            const chatID = (currentUser.uid < chatList[i]) ? (currentUser.uid + "-" + chatList[i]) : (chatList[i] + "-" + currentUser.uid);
                            await updateDoc(doc(db, "users", chatList[i]), {
                                chatList: arrayRemove(currentUser.uid)
                            });
                            await deleteDoc(doc(db, "chat", chatID));
                        }
                    }
                    await deleteDoc(doc(db, "users", currentUser.uid));
                } else {
                    console.log("No such document!");
                }
                await deleteUser(currentUser)
                    .then(() => {
                        console.log("Account Deleted Successfully")
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorMessage);
                    });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });
        }
    }

    return (
        <div className="container min-w-[480px] relative bg-gradient-to-br from-gray-700 to-gray-950 flex flex-col justify-center items-center w-[50%] h-full m-auto rounded-xl gap-4">
            
            <BootstrapTooltip title="back">
                <button onClick={() => { navigate("/") }} className="absolute top-2 left-2 z-10 bg-[#88b430] rounded-full cursor-pointer p-2 flex items-center justify-center"><ArrowBackIcon className="text-black"/></button>
            </BootstrapTooltip>

            <div className="relative">

                <MyAvatar width={'200px'} height={'200px'} src={currentUser.photoURL} className='border-2 border-solid border-[#1f7474]' />

                <div className="bg-gradient-to-br from-gray-700 to-gray-950 absolute bottom-2 right-2 z-10 flex gap-2 rounded-full hover:border-2 hover:border-solid hover:border-[#1f7474]" onMouseEnter={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)}>
                    {showButton && (
                        <BootstrapTooltip title="remove picture">
                            <button onClick={handleRemovePP} className="bg-[#6B6E70] rounded-full cursor-pointer p-2 flex items-center justify-center">
                                <CloseIcon className='text-black'/>
                            </button>
                        </BootstrapTooltip>
                    )}
                    <BootstrapTooltip title="edit">
                        <label for="ppUpload" className="bg-[#88b430] rounded-full cursor-pointer p-2 flex items-center justify-center">
                            <EditIcon className="text-black"/>
                        </label>
                    </BootstrapTooltip>
                </div>

                <input className="hidden" type="file" accept="image/*" id="ppUpload" onChange={handleEditPP} />

            </div>

            <EditDisplayName label="Display Name" fbkey="displayName" />
            
            <div className="p-4 flex justify-between w-[70%] items-center rounded-xl bg-gradient-to-r from-[#004545] to-[#1f7474]">
                <div className="flex flex-col items-start">
                    <p className="flex-shrink-0 inline-block whitespace-no-wrap text-[#ffffff] font-black">Email</p>
                    <span className="text-[#86C232] font-semibold">{currentUser.email}</span>
                </div>
                <BootstrapTooltip title="edit disabled">
                    <EditOffIcon />
                </BootstrapTooltip>
            </div>

            <div className="flex flex-row gap-2">
                <button onClick={handleDelAcc} className='gap-2 border border-transparent text-base font-semibold cursor-pointer transition-border-color duration-250 overflow-hidden text-black focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#842029] bg-[#DC3545] h-[40px] px-4 py-2 rounded-full focus:outline-none flex items-center justify-center'>
                    <PersonRemoveIcon />
                    Delete Account
                </button>
                <button onClick={handleLogout} className='gap-2 border border-transparent text-base font-semibold cursor-pointer transition-border-color duration-250 overflow-hidden text-black focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#997404] bg-[#FFC107] h-[40px] px-4 py-2 rounded-full focus:outline-none flex items-center justify-center'>
                    <LogoutIcon />
                    Log Out
                </button>
            </div>

        </div>
    )
}

export default Profile;