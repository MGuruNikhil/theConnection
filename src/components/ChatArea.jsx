import React from 'react'
import ChatHeader from './ChatHeader';
import Messages from './Messages';
import Send from './Send';

const ChatArea = () => {
    return (
        <div className="ChatArea w-2/3 flex flex-col">
            <ChatHeader />
            <Messages />
            <Send />
        </div>
    );
}

export default ChatArea;