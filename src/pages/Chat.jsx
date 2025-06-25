import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
    const { otherUser } = useContext(ChatContext);
    const [chatList, setChatList] = useState([]);
    const [matches, setMatches] = useState(window.matchMedia("(min-width: 768px)").matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const handler = e => setMatches(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        console.log('Chat Component State:', { otherUser, isMobile: !matches });
    }, [otherUser, matches]);

    // For desktop view (>= 768px)
    if (matches) {
        return (
            <div className="container min-w-[768px] w-[80%] h-full m-auto rounded-xl self-center overflow-hidden flex flex-row">
                <Sidebar chatList={chatList} setChatList={setChatList} />
                <ChatArea chatList={chatList} />
            </div>
        );
    }

    // For mobile view (< 768px)
    return (
        <div className="container w-full h-full m-auto rounded-xl self-center overflow-hidden">
            <div className={`${otherUser === null ? 'block' : 'hidden'} w-full h-full`}>
                <Sidebar chatList={chatList} setChatList={setChatList} />
            </div>
            <div className={`${otherUser !== null ? 'block' : 'hidden'} w-full h-full`}>
                <ChatArea chatList={chatList} />
            </div>
        </div>
    );
}

export default Chat;