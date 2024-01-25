import React from 'react'

const Send = () => {
    return (
        <div className="Send w-full flex flex-row bg-[#000000]">
            <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ minWidth: '0' }}
                placeholder='Type here'
            />
            <button className="send">Send</button>
        </div>
    );
}

export default Send;