import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const Send = () => {
    const { currentUser } = useContext(AuthContext);
    const { otherUser } = useContext(ChatContext);
    const { toast } = useToast();
    
    const ChatID = currentUser.uid < otherUser?.uid 
        ? currentUser.uid + "-" + otherUser?.uid 
        : otherUser?.uid + "-" + currentUser.uid;
    
    const messageRef = doc(db, 
        currentUser.isAnonymous || 'isAnonymous' in otherUser 
            ? "guestChats" 
            : "chats", 
        ChatID
    );
    
    const [msg, setMsg] = useState('');

    const handleSend = async () => {
        const message = msg.trim();
        if (!message) return;
        
        setMsg('');
        try {
            await updateDoc(messageRef, {
                messages: arrayUnion({
                    id: uuidv4(),
                    from: currentUser.uid,
                    message,
                    timeStamp: Timestamp.now(),
                }),
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex border-t bg-background p-4">
            <div className="flex w-full items-center gap-2">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    className="flex-1"
                />
                <Button
                    type="submit"
                    size="icon"
                    onClick={handleSend}
                    disabled={!msg.trim()}
                >
                    <SendHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default Send;