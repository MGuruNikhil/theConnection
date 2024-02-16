import React, { useContext, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, arrayUnion, setDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const SearchBar = () => {
    const {currentUser} = useContext(AuthContext);
    const {setOtherUser} = useContext(ChatContext);
    const [searchName, setSearchName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isErr, setIsErr] = useState(false);

    const handleSubmit = async (e) => {
        if (e.code === 'Enter') {
            const q = query(collection(db, 'users'), where('displayName', '==', searchName));
            try {
                const querySnapshot = await getDocs(q);
                const results = [];
                querySnapshot.forEach((doc) => {
                    results.push(doc.data());
                });
                console.log(results);
                setSearchResults(results);
            } catch (error) {
                console.log(error.message);
                setIsErr(true);
            }
        }
    };

    const handleResultClick = async (index) => {
        const clickedResult = searchResults[index];
        const theirUID = clickedResult.uid;
        const myUID = currentUser.uid;
        const chatID = (myUID < theirUID)?(myUID+"-"+theirUID):(theirUID+"-"+myUID);
        await updateDoc(doc(db,"users",myUID),{
            chatList: arrayUnion(theirUID)
        });
        await updateDoc(doc(db,"users",theirUID),{
            chatList: arrayUnion(myUID)
        });
        await setDoc(doc(db,"chats",chatID),{});
        setOtherUser(searchResults[index]);
        setSearchName("");
        setSearchResults([]);
    };

    return (
        <div className="SearchBar">
            <input
                type="text"
                className="w-full px-4 py-2 focus:outline-none"
                style={{ minWidth: '0' }}
                placeholder="Search..."
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleSubmit}
                value={searchName}
            />
            {searchResults && searchResults.map((result, index) => (
                <div key={index} onClick={() => handleResultClick(index)} className="resultItem max-h-[56px] flex flex-row p-2 gap-x-2 border-b-solid border-b-black border-b-2 overflow-hidden cursor-pointer">
                    <img className="rounded-[50%] object-cover" src={result.photoURL} alt="pp" width={'40px'} height={'40px'} />
                    <div className="info flex flex-col items-start justify-center">
                        <span className="font-bold text-lg text-left">{result.displayName}</span>
                        <p className="text-xs text-left">{result.email}</p>
                    </div>
                </div>
            ))}
            {isErr && <span>No user found</span>}
        </div>
    );
};

export default SearchBar;
