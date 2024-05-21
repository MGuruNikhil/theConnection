import React from 'react'
import SideHeader from './SideHeader';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

const Sidebar = () => {
    return (
        <div className="Sidebar w-1/3 flex flex-col">
            <SideHeader />
            <SearchBar />
            <ChatList />
        </div>
    );
}

export default Sidebar;