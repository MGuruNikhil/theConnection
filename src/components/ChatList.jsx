import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import GradientCircularProgress from '../materialUI/GradientCircularProgress';

const ChatList = () => {
    const { currentUser } = useContext(AuthContext);
    const { otherUser, setOtherUser } = useContext(ChatContext);
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const renderList = async () => {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), async (userData) => {
                setIsLoading(true);
                const resp = [];
                const chatListIds = userData.data().chatList;

                if (chatListIds.length != 0) {
                    const promises = chatListIds.map(async (uid) => {
                        const docRef = doc(db, "users", uid);
                        const docSnap = await getDoc(docRef);
                        resp.push(docSnap.data());
                    });
                    await Promise.all(promises);
                    setChatList(resp);
                }
                setIsLoading(false);
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
        <div className="ChatList flex-1 bg-gradient-to-br from-gray-700 to-gray-950 h-full overflow-y-scroll scrollbar-hidden">
            {(isLoading) ?
                <GradientCircularProgress /> :
                <>
                    {(chatList.length != 0) ? chatList.map((listItem, index) => (
                        <div key={index} onClick={() => handleClick(index)} className={`${listItem.uid === otherUser?.uid ? 'bg-gradient-to-r from-[#dd5a5a] to-[#9d1919]' : 'bg-gradient-to-r from-[#004545] to-[#1f7474]'} h-[56px] flex flex-row p-2 justify-between overflow-hidden cursor-pointer border-b-[1px] border-b-[#000000]`}>
                            <img className='rounded-[50%] object-cover' src={listItem.photoURL} alt="pp" width={'40px'} height={'40px'} />
                            <p className='self-center flex-1'>{listItem.displayName}</p>
                        </div>
                    )) : <div className='h-full w-full flex flex-col items-center justify-center p-2'>
                        <p>Chat with other users by searching their names or Email IDs in the search bar.</p>
                        <p>Give it a try.</p>
                    </div>
                    }
                </>
            }
        </div>
    );
}

export default ChatList;