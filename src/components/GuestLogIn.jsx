import { auth, db } from '../firebase';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import GradientCircularProgress from '../materialUI/GradientCircularProgress';
import { useNavigate } from 'react-router-dom';

const GuestLogIn = () => {

    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const searchNames = [
        'g',    'gu',    'gue',
        'gues', 'guest', 'u',
        'ue',   'ues',   'uest',
        'e',    'es',    'est',
        's',    'st',    't'
    ];

    const handleGuestLogin = async () => {
        setIsLoadingGuest(true);
        signInAnonymously(auth)
            .then( async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                console.log(userCredential);
                setIsLoadingGuest(false);
                await updateProfile(user, {
                    displayName: "Guest",
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
                }).catch((error) => {
                    setIsErr(true);
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    setError(errorMessage);
                });
                await setDoc(doc(db, "guests", user.uid), {
                    isAnonymous: true,
                    uid: user.uid,
                    displayName: "Guest",
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
                    searchNames,
                }).catch((error) => {
                    setIsErr(true);
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    setError(errorMessage);
                });
                navigate("/");
            })
            .catch((error) => {
                setIsErr(true);
                const errorMessage = error.message;
                console.log(errorMessage);
                setError(errorMessage);
                setIsLoadingGuest(false);
            });
    }

    return (
        <>
            <div className="p-2 flex items-center gap-2 text-[#61892F]">
                <div className="h-[1px] bg-[#61892F] grow"></div>
                <p>or</p>
                <div className="h-[1px] bg-[#61892F] grow"></div>
            </div>
            <button onClick={handleGuestLogin} className='min-w-[232px] rounded-md border border-transparent py-2 px-4 text-base font-semibold font-inherit bg-[#1a1a1a] cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus:outline-none focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#6a9317]'>
                {isLoadingGuest ? <GradientCircularProgress /> : <>Guest Log in</>}
            </button>
            {isErr && <span>{error}</span>}
        </>
    )
}

export default GuestLogIn;
