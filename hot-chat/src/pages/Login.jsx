import React from 'react'

const Login = () => {
    return (
        <div className="login">
            <div className="container flex flex-col space-y-5 max-w-fit m-auto">
                <h1>hotCHAT</h1>
                <h2>Log in</h2>
                <input className='p-2 border-b-2 border-b-purple-950 focus:outline-none' type="email" name="email" id="email" placeholder='Enter email' />
                <input className='p-2 border-b-2 border-b-purple-950 focus:outline-none' type="password" name="password" id="password" placeholder='Enter password' />
                <a className='cursor-pointer'>Forgot password ?</a>
                <button>Log in</button>
                <span>don't has an account ? <a className='cursor-pointer'>Sign up</a></span>
            </div>
        </div>
    );
}

export default Login;