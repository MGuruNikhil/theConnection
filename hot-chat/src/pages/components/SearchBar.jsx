import React from 'react'
import Dummy from './Dummy.jpg'

const SearchBar = () => {
    return (
        <div className="SearchBar">
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300"
                style={{ minWidth: '0' }}
                placeholder='Search...'
            />
            <div className="searchResult flex flex-row p-2 justify-between border-b-solid border-b-black border-b-2 overflow-hidden">
                <img className='rounded-[50%] object-cover' src={Dummy} alt="pp" width={'35px'} height={'35px'} />
                <p className='self-center flex-1'>Display Name</p>
            </div>
        </div>
    );
}

export default SearchBar;