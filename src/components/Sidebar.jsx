import React from 'react'
import SideHeader from './SideHeader';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

const Sidebar = ({chatList, setChatList}) => {
    return (
        <div className="Sidebar w-1/3 flex flex-col">
            <SideHeader />
            <SearchBar />
            <ChatList chatList={chatList} setChatList={setChatList}/>
        </div>
    );
}

export default Sidebar;