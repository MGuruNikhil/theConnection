import React from 'react'
import Dummy from '../assets/Dummy.jpg'

const ChatList = () => {
    return (
        <div className="ChatList flex-1 bg-[#474B4F] h-full overflow-y-scroll scrollbar-hidden">
            <div className="activeChat max-h-[56px] flex flex-row p-2 justify-between bg-[#222629] border-b-solid border-b-black border-b-2 overflow-hidden cursor-pointer">
                <img className='rounded-[50%] object-cover' src={Dummy} alt="pp" width={'40px'} height={'40px'} />
                <p className='self-center flex-1'>Display Name</p>
            </div>
            <div className="inactiveChat max-h-[56px] flex flex-row p-2 justify-between border-b-solid border-b-black border-b-2 overflow-hidden cursor-pointer">
                <img className='rounded-[50%] object-cover' src={Dummy} alt="pp" width={'40px'} height={'40px'} />
                <p className='self-center flex-1'>Display Name</p>
            </div>
        </div>
    );
}

export default ChatList;