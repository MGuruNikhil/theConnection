import React from 'react'
import SideHeader from './SideHeader';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

const Sidebar = () => {
    return (
        <div className="Sidebar w-1/3 border-r-solid border-r-purple-950 border-r-2 flex flex-col">
            <SideHeader />
            <SearchBar />
            <ChatList />
        </div>
    );
}

export default Sidebar;