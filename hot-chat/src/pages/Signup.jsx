import React from 'react'

const Signup = () => {
    return (
        <div className="signup">
            <div className="container flex flex-col space-y-5">
                <h1>hotCHAT</h1>
                <h2>Sign Up</h2>
                <input className='p-2 border-b-2 border-b-purple-950 focus:outline-none' type="text" name="displayName" id="displayName" placeholder='Enter name' />
                <input className='p-2 border-b-2 border-b-purple-950 focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-purple-950 focus:outline-none' type="password" name="password" id="password" placeholder='Enter password' />
                <a className='cursor-pointer'>Forgot password ?</a>
                <input type="file" name="profilePhoto" id="profilePhoto" />
                <button>Sign Up</button>
                <span>already has an account ? <a className='cursor-pointer'>Log in</a></span>
            </div>
        </div>
    );
}

export default Signup;