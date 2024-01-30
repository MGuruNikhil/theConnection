import React, { useState } from 'react'
import { auth, storage, db } from '../firebase.js'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, Navigate } from 'react-router-dom';

const Signup = () => {

    const [isErr,setIsErr] = useState(false);
    const [error,setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const photo = e.target[3].files[0];

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setIsErr(false);
                const user = userCredential.user;
                console.log(user);
                const storageRef = ref(storage, 'images/'+displayName+'.jpg');
                const uploadTask = uploadBytesResumable(storageRef, photo);
                uploadTask.on(
                (error) => {
                    setIsErr(true);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(user,{
                            displayName,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "users", user.uid),{
                            uid: user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        <Navigate to="/" replace={true} />
                    });
                }
                );
            })
            .catch((error) => {
                setIsErr(true);
                const errorCode = error.code;
                const errorMessage = error.message;
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
            <span>already has an account ? <Link to="/login">Log In</Link></span>
        </div>
    );
}

export default Signup;