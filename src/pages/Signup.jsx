import React, { useState } from 'react'
import { auth, storage, db } from '../firebase.js'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInAnonymously } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import GradientCircularProgress from '../materialUI/GradientCircularProgress.jsx';

const Signup = () => {

    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const navigate = useNavigate();

    function getAllSubstrings(str) {
        const lowerCaseStr = str.toLowerCase();
        const result = [];
        for (let i = 0; i < lowerCaseStr.length; i++) {
            for (let j = i + 1; j <= lowerCaseStr.length; j++) {
                result.push(lowerCaseStr.substring(i, j));
            }
        }
        return result;
    }

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value.trim();
        const email = e.target[1].value.trim();
        const password = e.target[2].value.trim();
        const photo = e.target[3].files[0];

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                setIsErr(false);
                const user = userCredential.user;
                console.log(user);
                const searchNames = getAllSubstrings(displayName);
                if (photo) {
                    const storageRef = ref(storage, 'profilePics/' + user.uid + '.jpg');
                    const uploadTask = uploadBytesResumable(storageRef, photo);
                    uploadTask.on(
                        (error) => {
                            setIsErr(true);
                            const errorMessage = error.message;
                            console.log(errorMessage);
                            setError(errorMessage);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                await updateProfile(user, {
                                    displayName,
                                    photoURL: downloadURL,
                                }).catch((error) => {
                                    setIsErr(true);
                                    const errorMessage = error.message;
                                    console.log(errorMessage);
                                    setError(errorMessage);
                                });
                                await setDoc(doc(db, "users", user.uid), {
                                    uid: user.uid,
                                    displayName,
                                    email,
                                    photoURL: downloadURL,
                                    searchNames,
                                })
                                    .then(() => {
                                        sendEmailVerification(auth.currentUser)
                                            .then(() => {
                                                alert("Email verification link sent, verify your email before logging in");
                                                navigate("/login");
                                            });
                                    }).catch((error) => {
                                        setIsErr(true);
                                        const errorMessage = error.message;
                                        console.log(errorMessage);
                                        setError(errorMessage);
                                    });
                            });
                        }
                    );
                }
                else {
                    await updateProfile(user, {
                        displayName,
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
                    }).catch((error) => {
                        setIsErr(true);
                        const errorMessage = error.message;
                        console.log(errorMessage);
                        setError(errorMessage);
                    });
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        displayName,
                        email,
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
                        searchNames,
                    }).then(() => {
                        sendEmailVerification(auth.currentUser).then(() => {
                            alert("Email verification link sent, verify your email before logging in");
                            navigate("/login");
                        });
                    }).catch((error) => {
                        setIsErr(true);
                        const errorMessage = error.message;
                        console.log(errorMessage);
                        setError(errorMessage);
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsErr(true);
                const errorMessage = error.message;
                console.log(errorMessage);
                setError(errorMessage);
                setIsLoading(false);
            });
    }

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
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName: "Guest",
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
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
        <div className="container p-10 bg-gradient-to-br from-gray-700 to-gray-950 flex flex-col justify-center space-y-5 max-w-fit m-auto rounded-xl">
            <h1 className="theName text-[2.4em] font-bold text-[#86C232]">theConnection</h1>
            <h2 className='signupLogin text-[1.2em] text-[#61892F]'>Sign Up</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="text" name="displayName" id="displayName" placeholder='Enter name' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Set password' />
                <label htmlFor="profilePhoto" className='flex gap-2 cursor-pointer'>
                    <AddPhotoAlternateIcon className='text-[#86c232]'/>
                    <span>Add a profile pic</span>
                </label>
                <input className="hidden" type="file" accept="image/*" name="profilePhoto" id="profilePhoto" />
                <button className='min-w-[232px] rounded-md border border-transparent py-2 px-4 text-base font-semibold font-inherit bg-[#1a1a1a] cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus:outline-none focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#6a9317]'>
                    {isLoading ? <GradientCircularProgress /> : <>Sign Up</>}
                </button>
                {isErr && <span>{error}</span>}
            </form>
            <div className='flex items-center justify-center gap-2'>
                <span className='flex-shrink-0 inline-block whitespace-no-wrap'>already have an account ?</span>
                <Link className='flex-shrink-0 inline-block whitespace-no-wrap font-medium text-[#646cff] no-underline hover:text-[#535bf2]' to="/login">Log In</Link>
            </div>
            <div className="p-2 flex items-center gap-2 text-[#61892F]">
                <div className="h-[1px] bg-[#61892F] grow"></div>
                <p>or</p>
                <div className="h-[1px] bg-[#61892F] grow"></div>
            </div>
            <button onClick={handleGuestLogin} className='min-w-[232px] rounded-md border border-transparent py-2 px-4 text-base font-semibold font-inherit bg-[#1a1a1a] cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus:outline-none focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#6a9317]'>
                {isLoadingGuest ? <GradientCircularProgress /> : <>Guest Log in</>}
            </button>
        </div>
    );
}

export default Signup;