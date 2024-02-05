import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebase';

const Send = () => {
    const {currentUser} = useContext(AuthContext);
    const {otherUser} = useContext(ChatContext);
    const ChatID = (currentUser.uid < otherUser?.uid)?(currentUser.uid+"-"+otherUser?.uid):(otherUser?.uid+"-"+currentUser.uid);
    const [message, setMessage] = useState('');
    const handleSend = async () => {
        const docRef = await addDoc(collection(db,"chats",ChatID,"messages"), {
            message,
            from: currentUser.uid,
        });
        console.log(docRef.id);
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