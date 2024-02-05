import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';

const ChatHeader = () => {
    const {otherUser} = useContext(ChatContext);
    return (
        <div className="ChatHeader max-h-[56px] w-full flex flex-row p-2 bg-[#61892F]">
            <img src={otherUser?.photoURL} width={'40px'} height={'40px'} alt="pp" className='rounded-[50%] object-cover' />
            <p className='flex-1 self-center'>{otherUser?.displayName}</p>
        </div>
    );
}

export default ChatHeader;