import React, { useContext } from 'react'
import { ImgContext } from '../context/ImgContext'
import CloseIcon from '@mui/icons-material/Close';

const FullImg = () => {

    const { imgUrl, isActive, setIsActive } = useContext(ImgContext);

    return (
        <div onClick={() => {setIsActive(false);}} className={`${isActive ? 'flex' : 'hidden'} w-full h-full items-center justify-center bg-inherit backdrop-blur-sm z-50 fixed top-0 right-0 left-0 bottom-0`}>
            <button onClick={() => {setIsActive(false);}} className='fixed top-2 right-2 z-50'><CloseIcon /></button>
            <img onClick={(e) => e.stopPropagation()} className='max-w-[90%] max-h-[90%]' src={imgUrl} alt="profile pic" />          
        </div>
    )
}

export default FullImg;
