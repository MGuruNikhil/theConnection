import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {
    const {currentUser} = useContext(AuthContext);
    const {otherUser} = useContext(ChatContext);
    const ChatID = (currentUser.uid < otherUser?.uid)?(currentUser.uid+"-"+otherUser?.uid):(otherUser?.uid+"-"+currentUser.uid);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const renderMessages = () => {
            const unsub = onSnapshot(doc(db, "chats", ChatID), (chats) => {
                setChats(chats.data().messages);
            });
            return () => {
                unsub();
            };
        };
        otherUser?.uid && renderMessages();
    }, [otherUser?.uid]);

    return (
        <div className="Messages flex-1 bg-gray-950 flex flex-col gap-2 overflow-scroll p-2 scrollbar-hidden">
            {chats && chats.map((chat, index) => (  
                <div key={index} className={`bg-[#86C232] ${chat.from === currentUser.uid ? 'place-self-end rounded-tr-none' : 'place-self-start rounded-tl-none'} px-4 py-2 rounded-xl`}>{chat.message}</div>
            ))}
        </div>
    );
}

export default Messages;