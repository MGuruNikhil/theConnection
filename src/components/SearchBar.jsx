import React, { useContext, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, arrayUnion, setDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import BootstrapTooltip from '../materialUI/BootstrapTooltip';
import MyAvatar from './MyAvatar';
import GradientCircularProgress from '../materialUI/GradientCircularProgress';

const SearchBar = () => {
    const { currentUser } = useContext(AuthContext);
    const { setOtherUser } = useContext(ChatContext);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isErr, setIsErr] = useState(true);
    const [errMsg, setErrMsg] = useState('Search for users by name or email');
    const [isFocus, setIsFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (searchTerm) => {
        const results = new Map(); // Using Map to deduplicate results
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        try {
            // Search in users collection
            const userNameQuery = query(collection(db, 'users'), 
                where('searchNames', 'array-contains', lowerSearchTerm)
            );
            const userEmailQuery = query(collection(db, 'users'),
                where('email', '==', searchTerm)
            );
            
            // Execute both queries for users
            const [userNameSnapshot, userEmailSnapshot] = await Promise.all([
                getDocs(userNameQuery),
                getDocs(userEmailQuery)
            ]);

            // Add results from display name search
            userNameSnapshot.forEach((doc) => {
                const userData = doc.data();
                results.set(userData.uid, userData);
            });

            // Add results from email search
            userEmailSnapshot.forEach((doc) => {
                const userData = doc.data();
                results.set(userData.uid, userData);
            });

            // Search in guests collection (only by display name)
            const guestQuery = query(collection(db, 'guests'), 
                where('searchNames', 'array-contains', lowerSearchTerm)
            );
            const guestSnapshot = await getDocs(guestQuery);
            
            guestSnapshot.forEach((doc) => {
                const guestData = doc.data();
                results.set(guestData.uid, guestData);
            });

            return Array.from(results.values());
        } catch (error) {
            console.error("Search error:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        const searchTerm = searchText.trim();
        
        if (searchTerm.length === 0) {
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
            setIsErr(true);
            setErrMsg("An error occurred while searching");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = async (index) => {
        const clickedResult = searchResults[index];
        const theirUID = clickedResult.uid;
        const myUID = currentUser.uid;
        const chatID = (myUID < theirUID) ? (myUID + "-" + theirUID) : (theirUID + "-" + myUID);
        const myCategory = (currentUser.isAnonymous) ? 'guests' : 'users';
        const theirCategory = ('isAnonymous' in clickedResult) ? 'guests' : 'users';
        const myList = (theirCategory === 'users') ? 'chatList' : 'guestList';
        const theirList = (myCategory === 'users') ? 'chatList' : 'guestList';
        await updateDoc(doc(db, myCategory, myUID), {
            [myList]: arrayUnion(theirUID)
        });
        await updateDoc(doc(db, theirCategory, theirUID), {
            [theirList]: arrayUnion(myUID)
        });
        if(myCategory === 'guests' || theirCategory === 'guests') {
            await setDoc(doc(db, "guestChats", chatID), {});
        } else {
            await setDoc(doc(db, "chats", chatID), {});
        }
        setOtherUser(searchResults[index]);
        setSearchText("");
        setSearchResults([]);
        setIsFocus(false);
        setIsErr(false);
    };

    return (
        <div className="flex flex-col bg-gradient-to-br from-gray-700 to-gray-950 overflow-hidden">
            <div className='flex w-full bg-[#2b2a33]'>
                {(!isFocus) ?
                    <BootstrapTooltip title="search">
                        <button 
                            onClick={() => { 
                                setIsFocus(true);
                                setIsErr(true);
                                setErrMsg("Search for users by name or email");
                            }} 
                            className='px-3 hover:bg-gray-700 transition-colors'
                        >
                            <SearchIcon />
                        </button>
                    </BootstrapTooltip>
                    :
                    <BootstrapTooltip title="back">
                        <button 
                            onClick={() => { 
                                setIsFocus(false); 
                                setIsErr(false); 
                                setSearchText(''); 
                                setSearchResults([]); 
                            }} 
                            className='px-3 hover:bg-gray-700 transition-colors'
                        >
                            <ArrowBackIcon />
                        </button>
                    </BootstrapTooltip>
                }
                <input
                    type="text"
                    className="px-4 py-3 focus:outline-none grow bg-transparent text-white placeholder-gray-400"
                    style={{ minWidth: '0' }}
                    placeholder={isFocus ? "Search by name or email" : "Search..."}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        if (e.target.value.trim() === '') {
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
                    value={searchText}
                />
            </div>
            {isFocus && (
                <div className="search-results-container bg-inherit">
                    <div className="h-[300px] overflow-y-auto">
                        {isLoading ? (
                            <div className='w-full h-full flex items-center justify-center'>
                                <GradientCircularProgress />
                            </div>
                        ) : isErr ? (
                            <div className='p-4 text-center text-gray-400'>{errMsg}</div>
                        ) : searchResults.length === 0 ? (
                            <div className='p-4 text-center text-gray-400'>No results found</div>
                        ) : (
                            searchResults.map((result, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => handleResultClick(i)} 
                                    className="resultItem flex flex-row p-3 gap-x-3 border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    <MyAvatar src={result.photoURL} width={'40px'} height={'40px'} />
                                    <div className="info flex flex-col items-start justify-center">
                                        <span className="font-bold text-lg text-left text-white">{result.displayName}</span>
                                        <p className="text-xs text-left text-gray-300">{result.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
