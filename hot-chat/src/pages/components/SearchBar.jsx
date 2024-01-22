import React from 'react'

const SearchBar = () => {
    return (
        <div className="SearchBar flex items-center">
            <input
                type="text"
                className="flex-grow px-4 py-2 border border-gray-300 rounded"
                style={{ minWidth: '0' }}
                placeholder='Search...'
            />
            <button className="ml-4 px-4 py-2 bg-blue-500 text-white">search</button>
        </div>
    );
}

export default SearchBar;