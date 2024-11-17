import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import SendIcon from '@mui/icons-material/Send';

const Send = () => {
    const { currentUser } = useContext(AuthContext);
    const { otherUser } = useContext(ChatContext);
    const ChatID = (currentUser.uid < otherUser?.uid) ? (currentUser.uid + "-" + otherUser?.uid) : (otherUser?.uid + "-" + currentUser.uid);
    let messageRef;
    if(currentUser.isAnonymous || 'isAnonymous' in otherUser) {
        messageRef = doc(db, "guestChats", ChatID);
    } else {
        messageRef = doc(db, "chats", ChatID);
    }
    const [msg, setMsg] = useState('');

    const handleSend = async () => {
        const message = msg.trim();
        setMsg('');
        if (message != '') {
            await updateDoc(messageRef, {
                messages: arrayUnion({
                    id: uuidv4(),
                    from: currentUser.uid,
                    message,
                    timeStamp: Timestamp.now(),
                }),
            });
        }
    }
    return (
        <div className="Send w-full flex flex-row bg-[#000000]">
            <input
                type="text"
                className="flex-1 px-4 py-2 focus:outline-none"
                style={{ minWidth: '0' }}
                placeholder='Type here...'
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSend();
                    }
                }}
            />
            <button onClick={handleSend} className="send rounded-r-md border border-transparent py-2 px-4 text-base font-semibold font-inherit bg-[#1a1a1a] cursor-pointer transition-border-color duration-250 overflow-hidden text-[#86C232] focus:outline-none focus-visible:ring-4 focus-visible:ring-auto focus-visible:ring-[#86C232] hover:border-[#86C232]"><SendIcon /></button>
        </div>
    );
}

export default Send;