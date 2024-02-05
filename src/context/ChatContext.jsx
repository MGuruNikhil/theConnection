import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {
    const [otherUser, setOtherUser] = useState(null);

    return (
        <ChatContext.Provider value={{otherUser ,setOtherUser}}>
            {children}
        </ChatContext.Provider>
    );
};