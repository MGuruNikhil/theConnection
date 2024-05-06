import React, { Component, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { ChatContext } from '../context/ChatContext';

class Chat extends Component {

    static contextType = ChatContext;

    constructor(props) {
        super(props)
        this.state = { matches: window.matchMedia("(min-width: 768px)").matches };
    }

    componentDidMount() {
        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 768px)").addEventListener('change', handler);
    }

    render() {

        const { otherUser } = this.context;

        return (
            <>
                {this.state.matches && (
                    <div className="container min-w-[768px] w-[80%] h-full m-auto self-center rounded-lg overflow-hidden border-2 border-[#86C232] border-solid flex flex-row">
                        <Sidebar />
                        <ChatArea />
                    </div>
                )}
                {(!this.state.matches && otherUser==null) && (
                    <div className="container w-[80%] h-full m-auto self-center rounded-lg overflow-hidden border-2 border-[#86C232] border-solid">
                        <Sidebar />
                    </div>                
                )}
                {(!this.state.matches && otherUser!=null) && (
                    <div className="container w-[80%] h-full m-auto self-center rounded-lg overflow-hidden border-2 border-[#86C232] border-solid">
                        <ChatArea />
                    </div>
                )}
            </>
        );
    }
}

export default Chat;