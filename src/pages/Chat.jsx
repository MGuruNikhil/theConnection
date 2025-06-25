import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { ChatContext } from '../context/ChatContext';
import { cn } from "@/lib/utils"

const Chat = () => {
    const { otherUser } = useContext(ChatContext);
    const [chatList, setChatList] = useState([]);
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const handler = e => setMatches(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    if (matches) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="flex h-[80vh] w-full overflow-hidden rounded-lg border bg-background shadow-lg sm:w-full md:w-[768px] lg:w-[1024px] xl:w-[1280px]">
                    <Sidebar 
                        chatList={chatList} 
                        setChatList={setChatList}
                        className="w-[320px] flex-shrink-0 border-r"
                    />
                    <ChatArea 
                        chatList={chatList}
                        className="flex-1 min-w-0"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-background">
            <div
                className={cn(
                    "fixed inset-0 w-full transition-all duration-300 ease-in-out",
                    otherUser === null ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <Sidebar 
                    chatList={chatList} 
                    setChatList={setChatList}
                    className="h-full w-full"
                />
            </div>
            <div
                className={cn(
                    "fixed inset-0 w-full transition-all duration-300 ease-in-out",
                    otherUser !== null ? "translate-x-0" : "translate-x-full"
                )}
            >
                <ChatArea 
                    chatList={chatList}
                    className="h-full w-full"
                />
            </div>
        </div>
    );
}

export default Chat;