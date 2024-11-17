import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {

    const { otherUser } = useContext(ChatContext);
    const [chatList, setChatList] = useState([]);
    const [matches, setMatches] = useState(window.matchMedia("(min-width: 768px)").matches);

    useEffect(() => {
        const handler = e => setMatches(e.matches);
        window.matchMedia("(min-width: 768px)").addEventListener('change', handler);
    },[]);

    return (
        <>
            {matches && (
                <div className="container min-w-[768px] w-[80%] h-full m-auto rounded-xl self-center overflow-hidden flex flex-row">
                    <Sidebar chatList={chatList} setChatList={setChatList}/>
                    <ChatArea chatList={chatList}/>
                </div>
            )}
            {(!matches && otherUser==null) && (
                <div className="container w-[80%] h-full m-auto rounded-xl self-center overflow-hidden">
                    <Sidebar chatList={chatList} setChatList={setChatList}/>
                </div>                
            )}
            {(!matches && otherUser!=null) && (
                <div className="container w-[80%] h-full m-auto rounded-xl self-center overflow-hidden">
                    <ChatArea chatList={chatList}/>
                </div>
            )}
        </>
    );
}

export default Chat;