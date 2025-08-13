import React, { useContext } from 'react'
import { ImgContext } from '../context/ImgContext'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

const MyAvatar = ({ width, height, src, className }) => {
    const { setIsActive, setImgUrl } = useContext(ImgContext);

    const handleClick = () => {
        setImgUrl(src);
        setIsActive(true);
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            style={{ 
                maxWidth: width, 
                maxHeight: height,
                minWidth: width,
                minHeight: height 
            }}
            className="flex items-center justify-center"
        >
            <Avatar
                onClick={handleClick}
                className={cn(
                    "cursor-pointer hover:ring-2 hover:ring-primary",
                    className
                )}
                style={{ 
                    width, 
                    height 
                }}
            >
                <AvatarImage src={src} alt="Profile picture" />
                <AvatarFallback>
                    <User className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

export default MyAvatar
