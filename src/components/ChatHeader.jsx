import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const ChatHeader = () => {
    const {otherUser, setOtherUser} = useContext(ChatContext);
    return (
        <div className="ChatHeader h-[56px] w-full flex flex-row p-2 bg-[#61892F]">
            <div className='flex gap-2'>
                <button onClick={() => { setOtherUser(null) }} className="border border-transparent text-base font-semibold font-inherit cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232] h-[40px] w-[40px] px-1 py-2 bg-inherit rounded-full focus:outline-none flex items-center justify-center"><ArrowBackIcon className='text-black'/></button>
                <img src={otherUser?.photoURL} width={'40px'} height={'40px'} alt="pp" className='rounded-[50%] object-cover' />
            </div>
            <p className='flex-1 self-center'>{otherUser?.displayName}</p>
        </div>
    );
}

export default ChatHeader;