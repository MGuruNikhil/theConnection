import React, { useState } from 'react'
import { auth } from '../firebase.js'
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {

    const navigate = useNavigate();
    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setIsErr(false); 
            const user = userCredential.user;
            if(user.emailVerified) {
                navigate("/");
            }
            else {
                alert("Please complete email verification, verification link already sent to ", user.email);
                signOut(auth)
                .then(() => {
                    console.log('User logged out successfully');
                })
                .catch((error) => {
                    setIsErr(true);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                });
            }
        })
        .catch((error) => {
            setIsErr(true);
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        });
    }
    
    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        const email = prompt("Enter your registred email id");
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset mail is sent");
        })
        .catch((error) => {
            setIsErr(true);
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        });
    };

    return (
        <div className="login p-16 bg-gradient-to-br from-gray-700 to-gray-950 flex flex-col justify-center space-y-5 max-w-fit rounded-xl">
            <h1 className="text-[3.2em] leading-110 text-[#86C232]">hotCHAT</h1>
            <h2 className='text-[1.6em] text-[#61892F]'>Log in</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Enter password' />
                <a className='cursor-pointer font-medium text-[#646cff] no-underline hover:text-[#535bf2]' onClick={handleForgotPasswordClick}>Forgot password ?</a>
                <button className='min-w-[232px] rounded-md border border-transparent py-2 px-4 text-base font-semibold font-inherit bg-[#1a1a1a] cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus:outline-none focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#6a9317]'>Log in</button>
                {isErr && <span>{error}</span>}
            </form>
            <div className='flex items-center justify-center gap-2'>
                <span className='flex-shrink-0 inline-block whitespace-no-wrap'>don't have an account ?</span>
                <Link className='flex-shrink-0 inline-block whitespace-no-wrap font-medium text-[#646cff] no-underline hover:text-[#535bf2]' to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;