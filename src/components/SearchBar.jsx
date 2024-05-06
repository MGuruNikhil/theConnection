import React, { useContext, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, arrayUnion, setDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import Back from "../assets/back.png"

const SearchBar = () => {
    const { currentUser } = useContext(AuthContext);
    const { setOtherUser } = useContext(ChatContext);
    const [searchName, setSearchName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isErr, setIsErr] = useState(false);
    const [errMsg, setErrMsg] = useState('No user found');
    const [isFocus, setIsFocus] = useState(false);
    const [searchFilter, setSearchFilter] = useState('displayName');

    const handleRadioChange = (event) => {
        setSearchFilter(event.target.value);
    };

    const handleSubmit = async (e) => {
        if (e.code === 'Enter') {
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
        <div className="flex flex-col">
            <div className='flex w-full'>
                {(isFocus) &&
                    <button onClick={() => { setIsFocus(false); setIsErr(false); setSearchName(''); setSearchResults([]) }} className='bg-[#2B2A33] pl-2'><img src={Back} width={20} height={20} alt="back" /></button>
                }
                <input
                    type="text"
                    className="px-4 py-2 focus:outline-none grow"
                    style={{ minWidth: '0' }}
                    placeholder={(isFocus ? ((searchFilter === "displayName") ? "Search by name" : "Search by email") : "Search...")}
                    onChange={(e) => setSearchName(e.target.value)}
                    onFocus={() => { setIsFocus(true) }}
                    onKeyDown={handleSubmit}
                    value={searchName}
                />
            </div>
            {(isFocus) &&
                <div className='flex justify-between p-2'>
                    <div className='flex gap-2'>
                        <input
                            type="radio"
                            name="searchFilter"
                            id="displayName"
                            value="displayName"
                            checked={searchFilter === 'displayName'}
                            onChange={handleRadioChange}
                        />
                        <label htmlFor="displayName">Name</label>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type="radio"
                            name="searchFilter"
                            id="email"
                            value="email"
                            checked={searchFilter === 'email'}
                            onChange={handleRadioChange}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
            }
            {(searchResults.length != 0) && searchResults.map((result, index) => (
                <div key={index} onClick={() => handleResultClick(index)} className="resultItem max-h-[56px] flex flex-row p-2 gap-x-2 border-b-solid border-b-black border-b-2 overflow-hidden cursor-pointer">
                    <img className="rounded-[50%] object-cover" src={result.photoURL} alt="pp" width={'40px'} height={'40px'} />
                    <div className="info flex flex-col items-start justify-center">
                        <span className="font-bold text-lg text-left">{result.displayName}</span>
                        <p className="text-xs text-left">{result.email}</p>
                    </div>
                </div>
            ))}
            {(isErr && isFocus) && errMsg}
        </div>
    );
};

export default SearchBar;
