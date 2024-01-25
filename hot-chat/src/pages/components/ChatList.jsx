import React from 'react'
import Dummy from './Dummy.jpg'

const ChatList = () => {
    return (
        <div className="ChatList flex-1 bg-[#474B4F] h-full overflow-y-scroll scrollbar-hidden">
            <div className="activeChat flex flex-row p-2 justify-between bg-[#222629] border-b-solid border-b-black border-b-2 overflow-hidden">
                <img className='rounded-[50%] object-cover' src={Dummy} alt="pp" width={'35px'} height={'35px'} />
                <p className='self-center flex-1'>Display Name</p>
            </div>
            <div className="inactiveChat flex flex-row p-2 justify-between border-b-solid border-b-black border-b-2 overflow-hidden">
                <img className='rounded-[50%] object-cover' src={Dummy} alt="pp" width={'35px'} height={'35px'} />
                <p className='self-center flex-1'>Display Name</p>
            </div>
        </div>
    );
}

export default ChatList;