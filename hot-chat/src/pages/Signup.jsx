import React, { useState } from 'react'
import { auth } from '../firebase.js'
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {

    const [error,setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const photo = e.target[3].files[0];

        try {
            const signupRes = await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                });
        }
        catch(err) {
            setError(true);
        }
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
                {error && <span>Something went wrong</span>}
            </form>
            <span>already has an account ? <a className='cursor-pointer'>Log in</a></span>
        </div>
    );
}

export default Signup;