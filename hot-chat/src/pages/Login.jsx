import React from 'react'

const Login = () => {
    return (
        <div className="login p-28 bg-[#474B4F] flex flex-col space-y-5 max-w-fit m-auto border-solid border-2 rounded-lg border-[#86C232]"> 
            <h1>hotCHAT</h1>
            <h2>Log in</h2>
            <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
            <input className='p-2 border-b-2 border-b-[#86C232] focus:outline-none' type="password" name="password" id="password" placeholder='Enter password' />
            <a className='cursor-pointer'>Forgot password ?</a>
            <button>Log in</button>
            <span>don't has an account ? <a className='cursor-pointer'>Sign up</a></span>
        </div>
    );
}

export default Login;