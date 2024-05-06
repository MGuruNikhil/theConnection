import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';
import Back from '../assets/arrow.png'

const ChatHeader = () => {
    const {otherUser, setOtherUser} = useContext(ChatContext);
    return (
        <div className="ChatHeader h-[56px] w-full flex flex-row p-2 bg-[#61892F]">
            <div className='flex gap-2'>
                <button onClick={() => { setOtherUser(null) }} className="cursor-pointer p-2 flex items-center justify-center"><img src={Back} width={20} height={20} alt="back" /></button>
                <img src={otherUser?.photoURL} width={'40px'} height={'40px'} alt="pp" className='rounded-[50%] object-cover' />
            </div>
            <p className='flex-1 self-center'>{otherUser?.displayName}</p>
        </div>
    );
}

export default ChatHeader;