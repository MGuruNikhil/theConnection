import React, { useContext } from 'react'
import { ImgContext } from '../context/ImgContext'

const Avatar = (props) => {

    const { setIsActive, setImgUrl } = useContext(ImgContext);
    return (
        <img onClick={() => {setImgUrl(props.src); setIsActive(true);}} src={props.src} alt='profile picture' className={`${props.className} w-[${props.width}] h-[${props.height}] max-w-[${props.width}] max-h-[${props.height}] rounded-[50%] object-cover cursor-pointer hover:border-2 hover:border-solid hover:border-[#9d1919]`} />
    )
}

export default Avatar
