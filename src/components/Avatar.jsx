import React, { useContext } from 'react'
import { ImgContext } from '../context/ImgContext'

const Avatar = (props) => {

    const { setIsActive, setImgUrl } = useContext(ImgContext);
    return (
        <img onClick={() => {setImgUrl(props.src); setIsActive(true);}} width={props.width} height={props.height} src={props.src} alt={props.alt} className={`${props.className} w-[${props.width}] h-[${props.height}] rounded-[50%] object-cover cursor-pointer hover:border-2 hover:border-solid hover:border-[#9d1919]`} />
    )
}

export default Avatar
