import React, { useState } from 'react'
import { auth, storage, db } from '../firebase.js'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const photo = e.target[3].files[0];

        createUserWithEmailAndPassword(auth, email, password)
        .then( async (userCredential) => {
            setIsErr(false);
            const user = userCredential.user;
            console.log(user);
            if(photo) {
                const storageRef = ref(storage, 'profilePics/' + user.uid + '.jpg');
                console.log(storageRef);
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
                        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
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
                            })
                            .then(() => {
                                navigate("/");
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
                })
                .then(() => {
                    navigate("/");
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
        <div className="signup p-20 bg-[#474B4F] flex flex-col space-y-5 max-w-fit m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <h1>hotCHAT</h1>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="text" name="displayName" id="displayName" placeholder='Enter name' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Set password' />
                <input type="file" name="profilePhoto" id="profilePhoto" />
                <button>Sign Up</button>
                {isErr && <span>{error}</span>}
            </form>
            <span>already have an account ? <Link to="/login">Log In</Link></span>
        </div>
    );
}

export default Signup;