import React from 'react'
import Dummy from './Dummy.jpg'

const ChatList = () => {
    return (
        <div className="ChatList bg-pink-500 h-full overflow-y-scroll scrollbar-hidden">
            <div className="flex flex-row p-2 justify-between border-b-2 border-b-black border-solid bg-pink-300 overflow-hidden">
                <img className='rounded-full object-cover' src={Dummy} alt="pp" width={'35px'} height={'35px'} />
                <p className='self-center text-rose-950 flex-1'>Display Name</p>
            </div>
        </div>
    );
}

export default ChatList;