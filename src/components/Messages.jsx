import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const Messages = () => {
    const { currentUser } = useContext(AuthContext);
    const { otherUser } = useContext(ChatContext);
    const ChatID = currentUser.uid < otherUser?.uid 
        ? currentUser.uid + "-" + otherUser?.uid 
        : otherUser?.uid + "-" + currentUser.uid;
    const [chats, setChats] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const renderMessages = () => {
            const chatCategory = (currentUser.isAnonymous || 'isAnonymous' in otherUser) 
                ? 'guestChats' 
                : 'chats';
            
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
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [chats]);

    return (
        <ScrollArea ref={scrollRef} className="flex-1 bg-muted/30">
            <div className="flex flex-col gap-2 p-4">
                {chats?.map((chat, index) => (
                    <div
                        key={chat.id || index}
                        className={cn(
                            "flex w-full",
                            chat.from === currentUser.uid ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-xl px-4 py-2 text-sm",
                                chat.from === currentUser.uid
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {chat.message}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}

export default Messages;