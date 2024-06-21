import React, { useContext } from 'react'
import { ImgContext } from '../context/ImgContext'
import Avatar from '@mui/material/Avatar';

const MyAvatar = (props) => {

    const { setIsActive, setImgUrl } = useContext(ImgContext);
    return (
        <div className={`flex items-center justify-center max-w-[${props.width}] max-h-[${props.height}] min-w-[${props.width}] min-h-[${props.height}]`}>
            <Avatar onClick={() => {setImgUrl(props.src); setIsActive(true);}} src={props.src} sx={{ width: props.width, height: props.height }} alt='profile picture' className={`${props.className} cursor-pointer hover:border-2 hover:border-solid hover:border-[#9d1919]`} />
        </div>
    )
}

export default MyAvatar
