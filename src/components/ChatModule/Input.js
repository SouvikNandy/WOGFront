import React from 'react';
import { AiOutlineSend } from 'react-icons/ai';

import '../../assets/css/ChatModule/input.css';

const Input = ({ setMessage, sendMessage, message }) => {
    return(
        <form className="form">
            <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message?message.text: message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
            />
            <div className="send-button" onClick={e => sendMessage(e)}>
                <AiOutlineSend className="send-icon"/>
            </div>
        </form>
    )
}

export default Input;