import React from 'react'
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const Chat = () => {
    return (
        <div className="container w-full h-full m-auto self-center rounded border-2 border-purple-950 border-solid flex flex-row">
            <Sidebar />
            <ChatArea />
        </div>
    );
}

export default Chat;