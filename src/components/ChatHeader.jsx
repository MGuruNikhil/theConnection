import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';
import { ArrowLeft } from "lucide-react";
import MyAvatar from './MyAvatar';
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ChatHeader = () => {
    const { otherUser, setOtherUser } = useContext(ChatContext);

    return (
        <div className="flex h-14 items-center gap-3 border-b bg-gradient-to-r from-muted to-accent px-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOtherUser(null)}
                            className="hover:bg-primary/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Back</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-3">
                <MyAvatar 
                    src={otherUser?.photoURL}
                    width="40px"
                    height="40px"
                />
                <span className="text-sm font-medium">
                    {otherUser?.displayName}
                </span>
            </div>
        </div>
    );
}

export default ChatHeader;