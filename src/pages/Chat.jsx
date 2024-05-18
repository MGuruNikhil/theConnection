import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {

    const { otherUser } = useContext(ChatContext);
    const [matches, setMatches] = useState(window.matchMedia("(min-width: 768px)").matches)

    useEffect(() => {
        const handler = e => setMatches(e.matches);
        window.matchMedia("(min-width: 768px)").addEventListener('change', handler);
    },[]);

    return (
        <>
            {matches && (
                <div className="container min-w-[768px] w-[80%] h-full m-auto self-center rounded-lg overflow-hidden border-2 border-[#86C232] border-solid flex flex-row">
                    <Sidebar />
                    <ChatArea />
                </div>
            )}
            {(!matches && otherUser==null) && (
                <div className="container w-[80%] h-full m-auto self-center rounded-lg overflow-hidden border-2 border-[#86C232] border-solid">
                    <Sidebar />
                </div>                
            )}
            {(!matches && otherUser!=null) && (
                <div className="container w-[80%] h-full m-auto self-center rounded-lg overflow-hidden border-2 border-[#86C232] border-solid">
                    <ChatArea />
                </div>
            )}
        </>
    );
}

export default Chat;