import React from 'react'
import Dummy from './Dummy.jpg'

const ChatHeader = () => {
    return (
        <div className="ChatHeader w-full flex flex-row p-2 bg-[#61892F]">
            <img src={Dummy} width={'35px'} height={'35px'} alt="pp" className='rounded-[50%] object-cover' />
            <p className='flex-1 self-center'>Display Name</p>
        </div>
    );
}

export default ChatHeader;