import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const ChatList = () => {
    const {currentUser} = useContext(AuthContext);
    const {otherUser, setOtherUser} = useContext(ChatContext);
    const [chatList, setChatList] = useState([]);
    
    useEffect(() => {
        const renderList = async () => {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), async (userData) => {
                const resp = [];
                const chatListIds = userData.data().chatList;

                if(chatListIds) {
                    const promises = chatListIds.map(async (uid) => {
                        const docRef = doc(db, "users",uid);
                        const docSnap = await getDoc(docRef);
                        resp.push(docSnap.data());
                    });
                    await Promise.all(promises);
                    setChatList(resp);
                }
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && renderList();
    }, [currentUser.uid]);
    
    const handleClick = (index) => {
        setOtherUser(chatList[index]);
    }

    return (
        <div className="ChatList flex-1 bg-[#474B4F] h-full overflow-y-scroll scrollbar-hidden">
            {chatList && chatList.map((listItem, index) => (   
                <div key={index} onClick={()=>handleClick(index)} className={`${listItem.uid === otherUser?.uid ? 'bg-[#222629]' : ''} h-[56px] flex flex-row p-2 justify-between border-b-solid border-b-black border-b-[1px] overflow-hidden cursor-pointer`}>
                    <img className='rounded-[50%] object-cover' src={listItem.photoURL} alt="pp" width={'40px'} height={'40px'} />
                    <p className='self-center flex-1'>{listItem.displayName}</p>
                </div>
            ))}
        </div>
    );
}

export default ChatList;