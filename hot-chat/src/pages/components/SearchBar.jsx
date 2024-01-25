import React from 'react'

const SearchBar = () => {
    return (
        <div className="SearchBar">
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300"
                style={{ minWidth: '0' }}
                placeholder='Search...'
            />
        </div>
    );
}

export default SearchBar;