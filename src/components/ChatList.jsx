import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import MyAvatar from './MyAvatar';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { UserSearch } from "lucide-react"

const ChatList = ({chatList, setChatList}) => {
    const { currentUser } = useContext(AuthContext);
    const { otherUser, setOtherUser } = useContext(ChatContext);
    const myCategory = currentUser.isAnonymous ? 'guests' : 'users';
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const renderList = async () => {
            const unsub = onSnapshot(doc(db, myCategory, currentUser.uid), async (userData) => {
                setIsLoading(true);
                const resp = [];
                const chatListIds = userData.data().chatList;
                const guestListIds = userData.data().guestList;

                if (chatListIds) {
                    const promises = chatListIds.map(async (uid) => {
                        const docRef = doc(db, "users", uid);
                        const docSnap = await getDoc(docRef);
                        resp.push(docSnap.data());
                    });
                    await Promise.all(promises);
                    setChatList(resp);
                }

                if(guestListIds) {
                    const promises = guestListIds.map(async (uid) => {
                        const docRef = doc(db, "guests", uid);
                        const docSnap = await getDoc(docRef);
                        resp.push(docSnap.data());
                    });
                    await Promise.all(promises);
                    setChatList(resp);
                }

                setIsLoading(false);
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && renderList();
    }, [currentUser.uid]);

    const handleClick = (index) => {
        const selectedUser = chatList[index];
        setOtherUser(selectedUser);
    }

    return (
        <ScrollArea className="h-full">
            <div className="flex h-full flex-col bg-background">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : (
                    <>
                        {chatList.length > 0 ? (
                            chatList.map((listItem, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(index)}
                                    className={`
                                        flex cursor-pointer items-center gap-3 border-b p-4 transition-colors
                                        ${listItem.uid === otherUser?.uid
                                            ? 'bg-primary/10'
                                            : 'hover:bg-accent'
                                        }
                                    `}
                                >
                                    <MyAvatar 
                                        src={listItem.photoURL}
                                        width="40px"
                                        height="40px"
                                    />
                                    <span className="text-sm font-medium">
                                        {listItem.displayName}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <Card className="m-4 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                                    <UserSearch className="h-12 w-12 text-muted-foreground" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Chat with other users by searching their names or Email IDs in the search bar.
                                        </p>
                                        <p className="text-sm font-medium text-primary">
                                            Give it a try!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </ScrollArea>
    );
}

export default ChatList;