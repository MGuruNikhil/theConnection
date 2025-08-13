import React, { useContext, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, arrayUnion, setDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import MyAvatar from './MyAvatar';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

const SearchBar = () => {
    const { currentUser } = useContext(AuthContext);
    const { setOtherUser } = useContext(ChatContext);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isErr, setIsErr] = useState(true);
    const [errMsg, setErrMsg] = useState('Search for users by name or email');
    const [isFocus, setIsFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (searchTerm) => {
        const results = new Map();
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        try {
            const [userNameSnapshot, userEmailSnapshot] = await Promise.all([
                getDocs(query(
                    collection(db, 'users'),
                    where('searchNames', 'array-contains', lowerSearchTerm)
                )),
                getDocs(query(
                    collection(db, 'users'),
                    where('email', '==', searchTerm)
                ))
            ]);

            userNameSnapshot.forEach((doc) => results.set(doc.data().uid, doc.data()));
            userEmailSnapshot.forEach((doc) => results.set(doc.data().uid, doc.data()));

            const guestSnapshot = await getDocs(query(
                collection(db, 'guests'),
                where('searchNames', 'array-contains', lowerSearchTerm)
            ));
            
            guestSnapshot.forEach((doc) => results.set(doc.data().uid, doc.data()));

            return Array.from(results.values());
        } catch (error) {
            console.error("Search error:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        const searchTerm = searchText.trim();
        
        if (!searchTerm) {
            setSearchResults([]);
            setIsErr(true);
            setErrMsg("Please enter a name or email to search");
            return;
        }

        if (searchTerm.length < 2) {
            setIsErr(true);
            setErrMsg("Please enter at least 2 characters");
            return;
        }

        setIsLoading(true);
        setIsErr(false);
        setSearchResults([]);

        try {
            const results = await handleSearch(searchTerm);
            
            if (results.length === 0) {
                setIsErr(true);
                setErrMsg("No users found");
            } else {
                setIsErr(false);
                setSearchResults(results);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast({
                title: "Error",
                description: "An error occurred while searching",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = async (index) => {
        try {
            const clickedResult = searchResults[index];
            const theirUID = clickedResult.uid;
            const myUID = currentUser.uid;
            const chatID = myUID < theirUID ? myUID + "-" + theirUID : theirUID + "-" + myUID;
            const myCategory = currentUser.isAnonymous ? 'guests' : 'users';
            const theirCategory = 'isAnonymous' in clickedResult ? 'guests' : 'users';
            const myList = theirCategory === 'users' ? 'chatList' : 'guestList';
            const theirList = myCategory === 'users' ? 'chatList' : 'guestList';

            await updateDoc(doc(db, myCategory, myUID), {
                [myList]: arrayUnion(theirUID)
            });

            await updateDoc(doc(db, theirCategory, theirUID), {
                [theirList]: arrayUnion(myUID)
            });

            await setDoc(
                doc(db, myCategory === 'guests' || theirCategory === 'guests' ? "guestChats" : "chats", chatID),
                {}
            );

            setOtherUser(searchResults[index]);
            setSearchText("");
            setSearchResults([]);
            setIsFocus(false);
            setIsErr(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to start chat. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col bg-muted">
            <div className="flex items-center border-b p-2">
                <TooltipProvider>
                    {!isFocus ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsFocus(true);
                                        setIsErr(true);
                                        setErrMsg("Search for users by name or email");
                                    }}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Search</TooltipContent>
                        </Tooltip>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsFocus(false);
                                        setIsErr(false);
                                        setSearchText('');
                                        setSearchResults([]);
                                    }}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Back</TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>

                <Input
                    type="text"
                    className="flex-1 border-0 bg-transparent"
                    placeholder={isFocus ? "Search by name or email" : "Search..."}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        if (!e.target.value.trim()) {
                            setSearchResults([]);
                            setIsErr(true);
                            setErrMsg("Search for users by name or email");
                        }
                    }}
                    onFocus={() => {
                        if (!isFocus) {
                            setIsFocus(true);
                            setIsErr(true);
                            setErrMsg("Search for users by name or email");
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                            handleSubmit();
                        }
                    }}
                />

                {isFocus && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => !isLoading && handleSubmit()}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Search className="h-5 w-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Search</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {isFocus && (
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : isErr ? (
                        <div className="p-4 text-center text-muted-foreground">{errMsg}</div>
                    ) : searchResults.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">No results found</div>
                    ) : (
                        searchResults.map((result, i) => (
                            <div
                                key={i}
                                onClick={() => handleResultClick(i)}
                                className="flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-accent"
                            >
                                <MyAvatar
                                    src={result.photoURL}
                                    width="40px"
                                    height="40px"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {result.displayName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {result.email}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            )}
        </div>
    );
};

export default SearchBar;
