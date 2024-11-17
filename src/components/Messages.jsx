import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {
    const {currentUser} = useContext(AuthContext);
    const {otherUser} = useContext(ChatContext);
    const ChatID = (currentUser.uid < otherUser?.uid)?(currentUser.uid+"-"+otherUser?.uid):(otherUser?.uid+"-"+currentUser.uid);
    const [chats, setChats] = useState([]);
    const divRef = useRef(null);

    useEffect(() => {
        const renderMessages = () => {
            const chatCategory = ((currentUser.isAnonymous) || ('isAnonymous' in otherUser) ) ? 'guestChats' : 'chats';
            const unsub = onSnapshot(doc(db, chatCategory, ChatID), (chats) => {
                setChats(chats.data().messages);
            });
            return () => {
                unsub();
            };
        };
        otherUser?.uid && renderMessages();
    }, [otherUser?.uid, currentUser.uid, ChatID]);

    useEffect(() => {
        const div = divRef.current;
        if (div) {
          div.scrollTop = div.scrollHeight;
        }
    }, [chats]);

    return (
        <div className='bg-gradient-to-br from-gray-700 to-gray-950 flex-1 overflow-hidden'>
            <div ref={divRef} className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] flex flex-col gap-2 overflow-scroll p-2 scrollbar-hidden">
                {chats && chats.map((chat, index) => (  
                    <div key={index} className={`break-words max-w-[90%] ${chat.from === currentUser.uid ? 'place-self-end rounded-tr-none bg-gradient-to-bl from-[#207175] to-[#88b430]' : 'place-self-start rounded-tl-none bg-gradient-to-br from-[#207175] to-[#c13434]'} px-4 py-2 rounded-xl text-start`}>{chat.message}</div>
                ))}
            </div>
        </div>
    );
}

export default Messages;