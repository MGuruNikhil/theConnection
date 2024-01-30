import React, { useState } from 'react'
import { auth } from '../firebase.js'
import { signInWithEmailAndPassword } from "firebase/auth";
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
                console.log(user);
                navigate("/");
            })
            .catch((error) => {
                setIsErr(true);
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
    }

    return (
        <div className="login p-28 bg-[#474B4F] flex flex-col space-y-5 max-w-fit m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <h1>hotCHAT</h1>
            <h2>Log in</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Enter password' />
                <a className='cursor-pointer'>Forgot password ?</a>
                <button>Log in</button>
                {isErr && <span>{error}</span>}
            </form>
            <span>don't have an account ? <Link to="/signup">Sign Up</Link></span>
        </div>
    );
}

export default Login;