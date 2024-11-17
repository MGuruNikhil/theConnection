import React, { useContext, useEffect } from 'react'
import ChatHeader from './ChatHeader';
import Messages from './Messages';
import Send from './Send';
import { ChatContext } from '../context/ChatContext';
import CACover from './CACover';

const ChatArea = ({chatList}) => {
    const {currentUser} = useContext(ChatContext);
    const {otherUser, setOtherUser} = useContext(ChatContext);

    useEffect(() => {
        setOtherUser(null);
    }, [currentUser]);

    useEffect(() => {
        if(otherUser) {
            const index = chatList.findIndex((user) => user.uid === otherUser.uid);
            if(index === -1) {
                setOtherUser(null);
            }
        }
    }, [chatList]);

    if(otherUser) {
        return (
            <div className="ChatArea w-2/3 flex flex-col">
                <ChatHeader />
                <Messages />
                <Send />
            </div>
        );
    }
    else {
        return (
            <div className="ChatArea w-2/3 flex flex-col">
                <CACover />
            </div>
        );
    }
}

export default ChatArea;