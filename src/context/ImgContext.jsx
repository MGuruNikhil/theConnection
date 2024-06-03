import { createContext, useState } from "react";

export const ImgContext = createContext();

export const ImgContextProvider = ({children}) => {
    const [imgUrl, setImgUrl] = useState(null);
    const [isActive, setIsActive] = useState(false);

    return (
        <ImgContext.Provider value={{imgUrl ,setImgUrl , isActive, setIsActive}}>
            {children}
        </ImgContext.Provider>
    );
};