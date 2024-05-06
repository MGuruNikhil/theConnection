import React, { useContext } from 'react'
import ChatHeader from './ChatHeader';
import Messages from './Messages';
import Send from './Send';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import CACover from './CACover';

const ChatArea = () => {
    const {currentUser} = useContext(AuthContext);
    const {otherUser} = useContext(ChatContext);
    if(otherUser) {
        return (
            <div className="ChatArea w-2/3 flex flex-col">
                <ChatHeader />
                <Messages />
                <Send />
            </div>
        );
    }
    else {
        return (
            <div className="ChatArea w-2/3 flex flex-col">
                <CACover />
            </div>
        );
    }
}

export default ChatArea;