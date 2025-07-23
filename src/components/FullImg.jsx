import React, { useContext } from 'react'
import { ImgContext } from '../context/ImgContext'
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

const FullImg = () => {
    const { imgUrl, isActive, setIsActive } = useContext(ImgContext);

    const handleClose = () => {
        setIsActive(false);
    };

    return (
        <Dialog open={isActive} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <span style={{ display: 'none' }}></span>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                <img
                    src={imgUrl}
                    alt="Profile picture"
                    className="mx-auto h-auto max-w-[600px] w-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
            </DialogContent>
        </Dialog>
    )
}

export default FullImg;
