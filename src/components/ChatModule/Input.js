import React from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';

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
                {/* <AiOutlineSend className="send-icon"/> */}
                <FaRegPaperPlane className="send-icon" />
            </div>
        </form>
    )
}

export default Input;