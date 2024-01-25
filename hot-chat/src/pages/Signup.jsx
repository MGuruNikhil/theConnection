import React from 'react'

const Signup = () => {
    return (
        <div className="signup p-20 bg-[#474B4F] flex flex-col space-y-5 max-w-fit m-auto border-solid border-2 rounded-lg border-[#86C232]">
            <h1>hotCHAT</h1>
            <h2>Sign Up</h2>
            <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="text" name="displayName" id="displayName" placeholder='Enter name' />
            <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
            <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Set password' />
            <input type="file" name="profilePhoto" id="profilePhoto" />
            <button>Sign Up</button>
            <span>already has an account ? <a className='cursor-pointer'>Log in</a></span>
        </div>
    );
}

export default Signup;