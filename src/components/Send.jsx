import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore"; 
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const Send = () => {
    const {currentUser} = useContext(AuthContext);
    const {otherUser} = useContext(ChatContext);
    const ChatID = (currentUser.uid < otherUser?.uid)?(currentUser.uid+"-"+otherUser?.uid):(otherUser?.uid+"-"+currentUser.uid);
    const messageRef = doc(db, "chats", ChatID);
    const [message, setMessage] = useState('');
    const handleSend = async () => {
        await updateDoc(messageRef, {
            messages: arrayUnion({
                id: uuidv4(),
                from: currentUser.uid,
                message,
                timeStamp: Timestamp.now(),
            }),
        });        
        setMessage('');          
    }
    return (
        <div className="Send w-full flex flex-row bg-[#000000]">
            <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ minWidth: '0' }}
                placeholder='Type here...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend} className="send">Send</button>
        </div>
    );
}

export default Send;