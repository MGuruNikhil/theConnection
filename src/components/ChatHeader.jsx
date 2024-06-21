import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BootstrapTooltip from '../materialUI/BootstrapTooltip';
import MyAvatar from './MyAvatar';

const ChatHeader = () => {
    const {otherUser, setOtherUser} = useContext(ChatContext);
    return (
        <div className="ChatHeader h-[56px] w-full flex flex-row p-2 bg-gradient-to-r from-[#1f7474] to-[#c13434]">
            <div className='flex gap-2'>
                <BootstrapTooltip title="back">
                    <button onClick={() => { setOtherUser(null) }}><ArrowBackIcon className='text-black'/></button>
                </BootstrapTooltip>
                <MyAvatar src={otherUser?.photoURL} width={'40px'} height={'40px'} />
            </div>
            <p className='flex-1 self-center'>{otherUser?.displayName}</p>
        </div>
    );
}

export default ChatHeader;