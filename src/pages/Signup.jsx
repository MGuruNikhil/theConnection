import React, { useState } from 'react'
import { auth, storage, db } from '../firebase.js'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import addPP from '../assets/addPP.png'

const Signup = () => {

    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState("");
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
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
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
                            const errorCode = error.code;
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
                                    const errorCode = error.code;
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
                                        const errorCode = error.code;
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
                        const errorCode = error.code;
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
                    })
                        .then(() => {
                            sendEmailVerification(auth.currentUser)
                                .then(() => {
                                    alert("Email verification link sent, verify your email before logging in");
                                    navigate("/login");
                                });
                        }).catch((error) => {
                            setIsErr(true);
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorMessage);
                            setError(errorMessage);
                        });
                }
            })
            .catch((error) => {
                setIsErr(true);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                setError(errorMessage);
            });
    }

    return (
        <div className="signup p-16 bg-[#474B4F] flex flex-col justify-center space-y-5 max-w-fit m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <h1 className="text-[3.2em] leading-110 text-[#86C232]">hotCHAT</h1>
            <h2 className='text-[1.6em] text-[#61892F]'>Sign Up</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="text" name="displayName" id="displayName" placeholder='Enter name' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Set password' />
                <label htmlFor="profilePhoto" className='flex gap-2 cursor-pointer'>
                    <img src={addPP} alt="pp" />
                    <span>Add a profile pic</span>
                </label>
                <input className="hidden" type="file" accept="image/*" name="profilePhoto" id="profilePhoto" />
                <button className='min-w-[232px] rounded-md border border-transparent py-2 px-4 text-base font-semibold font-inherit bg-[#1a1a1a] cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus:outline-none focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232]'>Sign Up</button>
                {isErr && <span>{error}</span>}
            </form>
            <div className='flex items-center justify-center gap-2'>
                <span className='flex-shrink-0 inline-block whitespace-no-wrap'>already have an account ?</span>
                <Link className='flex-shrink-0 inline-block whitespace-no-wrap font-medium text-[#646cff] no-underline hover:text-[#535bf2]' to="/login">Log In</Link>
            </div>
        </div>
    );
}

export default Signup;