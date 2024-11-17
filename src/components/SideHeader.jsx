import React, { useContext } from 'react';
import { auth, db, storage } from '../firebase';
import { deleteUser, signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import BootstrapTooltip from '../materialUI/BootstrapTooltip';
import MyAvatar from './MyAvatar';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const SideHeader = () => {
    const { currentUser } = useContext(AuthContext);
    const displayName = currentUser.displayName;
    const photoURL = currentUser.photoURL;
    const navigate = useNavigate();

    const deleteAnonAcc = async () => {
        const fileRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');

        getDownloadURL(fileRef).then(() => {
            // File exists, proceed with deletion
            deleteObject(fileRef)
            .then(() => {
                console.log("File deleted successfully");
            })
                .catch((error) => {
                    console.error("Error deleting file:", error);
                });
        }).catch((error) => {
            if (error.code === "storage/object-not-found") {
                console.log("File does not exist");
            } else {
                console.error("Error fetching download URL:", error);
            }
        });

        const docRef = doc(db, "guests", currentUser.uid);
        const docSnap = await getDoc(docRef);
        let chatList;
        if (docSnap.exists()) {
            chatList = docSnap.data().chatList;
            if(chatList) {
                for (let i = 0; i < chatList.length; i++) {
                    const chatID = (currentUser.uid < chatList[i]) ? (currentUser.uid + "-" + chatList[i]) : (chatList[i] + "-" + currentUser.uid);
                    await updateDoc(doc(db, "users", chatList[i]), {
                        guestList: arrayRemove(currentUser.uid)
                    });
                    await deleteDoc(doc(db, "guestChats", chatID));
                }
            }
            chatList = docSnap.data().guestList;
            if(chatList) {
                for (let i = 0; i < chatList.length; i++) {
                    const chatID = (currentUser.uid < chatList[i]) ? (currentUser.uid + "-" + chatList[i]) : (chatList[i] + "-" + currentUser.uid);
                    await updateDoc(doc(db, "guests", chatList[i]), {
                        guestList: arrayRemove(currentUser.uid)
                    });
                    await deleteDoc(doc(db, "guestChats", chatID));
                }
            }
            await deleteDoc(doc(db, "guests", currentUser.uid));
        } else {
            console.log("No such document!");
        }
        await deleteUser(currentUser).then(() => {
            console.log("Account Deleted Successfully")
        }).catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    }

    const handleLogout = () => {
        let confirmLogout;
        if(currentUser.isAnonymous) {
            confirmLogout = window.confirm('Since this is a temporary account, your account will be deleted if u log out, Are you sure you want to log out ?');
        } else {
            confirmLogout = window.confirm('Are you sure you want to log out ?');
        }
        if (confirmLogout) {
            if(currentUser.isAnonymous) {
                deleteAnonAcc();
                return;
            }
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
            <MyAvatar src={photoURL} width={'40px'} height={'40px'} />
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
