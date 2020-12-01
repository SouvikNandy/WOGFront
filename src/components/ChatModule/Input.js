import React from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import {HiOutlinePhotograph} from 'react-icons/hi'

import '../../assets/css/ChatModule/input.css';

const Input = ({ setMessage, sendMessage, message, addAttachment }) => {
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
            {addAttachment?
                <div className="add-attachments">
                    <span className="add-attachments-text"><HiOutlinePhotograph/></span>
                    
                    <input type="file" className="add-shot-input" onChange={addAttachment} />
                </div>
                :
                ""
            
        
            }
            
            <div className="send-button" onClick={e => sendMessage(e)}>
                <FaRegPaperPlane className="send-icon" />
            </div>
        </form>
    )
}

export default Input;