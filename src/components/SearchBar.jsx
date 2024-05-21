import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, arrayUnion, setDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import FullWidthTabs from '../materialUI/FullWidthTabs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BootstrapTooltip from '../materialUI/BootstrapTooltip';

const SearchBar = () => {
    const { currentUser } = useContext(AuthContext);
    const { setOtherUser } = useContext(ChatContext);
    const [searchName, setSearchName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isErr, setIsErr] = useState(true);
    const [errMsg, setErrMsg] = useState('Search for some user');
    const [isFocus, setIsFocus] = useState(false);
    const [searchFilter, setSearchFilter] = useState('displayName');

    useEffect(() => {
        handleSubmit();
    }, [searchFilter])

    const handleSubmit = async () => {
        if (searchName.length > 0) {
            setSearchResults([]);
            setIsErr(false);
            let q;
            if (searchFilter === "displayName") {
                const lowerSname = searchName.toLowerCase();
                q = query(collection(db, 'users'), where('searchNames', 'array-contains', lowerSname));
            }
            else {
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const isValid = emailPattern.test(searchName);
                if (!isValid) {
                    setIsErr(true);
                    setErrMsg("Invalid Email ID");
                    return;
                }
                q = query(collection(db, "users"), where("email", "==", searchName));
            }
            try {
                const querySnapshot = await getDocs(q);
                const results = [];
                querySnapshot.forEach((doc) => {
                    results.push(doc.data());
                });
                console.log(results);
                if (results.length == 0) {
                    setIsErr(true);
                    setErrMsg("No user found");
                }
                setSearchResults(results);
            } catch (error) {
                console.log(error.message);
                setIsErr(true);
                setErrMsg("No user found");
            }
        } else {
            setSearchResults([]);
            setIsErr(true);
            setErrMsg("Search for some user");
        }
    };

    const handleResultClick = async (index) => {
        const clickedResult = searchResults[index];
        const theirUID = clickedResult.uid;
        const myUID = currentUser.uid;
        const chatID = (myUID < theirUID) ? (myUID + "-" + theirUID) : (theirUID + "-" + myUID);
        await updateDoc(doc(db, "users", myUID), {
            chatList: arrayUnion(theirUID)
        });
        await updateDoc(doc(db, "users", theirUID), {
            chatList: arrayUnion(myUID)
        });
        await setDoc(doc(db, "chats", chatID), {});
        setOtherUser(searchResults[index]);
        setSearchName("");
        setSearchResults([]);
        setIsFocus(false);
        setIsErr(false);
    };

    return (
        <div className="flex flex-col bg-gradient-to-br from-gray-700 to-gray-950">
            <div className='flex w-full'>
                {(isFocus) &&
                    <BootstrapTooltip title="back">
                        <button onClick={() => { setIsFocus(false); setIsErr(false); setSearchName(''); setSearchResults([]) }} className='bg-[#2B2A33] pl-2'><ArrowBackIcon /></button>
                    </BootstrapTooltip>
                }
                <input
                    type="text"
                    className="px-4 py-2 focus:outline-none grow"
                    style={{ minWidth: '0' }}
                    placeholder={(isFocus ? ((searchFilter === "displayName") ? "Search by name" : "Search by email") : "Search...")}
                    onChange={(e) => setSearchName(e.target.value)}
                    onFocus={() => { if(!isFocus) { setIsErr(true); setErrMsg("Search for some user"); setIsFocus(true);} }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                    value={searchName}
                />
            </div>
            {(isFocus) &&
                <FullWidthTabs setSearchFilter={setSearchFilter} searchResults={searchResults} isErr={isErr} errMsg={errMsg} handleResultClick={handleResultClick}/>
            }

        </div>
    );
};

export default SearchBar;
