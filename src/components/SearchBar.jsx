import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const SearchBar = () => {
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

    return (
        <div className="SearchBar">
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300"
                style={{ minWidth: '0' }}
                placeholder="Search..."
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleSubmit}
            />
            {searchResults.map((result, index) => (
                <div key={index} className="resultItem max-h-[56px] flex flex-row p-2 gap-x-2 border-b-solid border-b-black border-b-2 overflow-hidden">
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
