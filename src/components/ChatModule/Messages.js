import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';

import '../../assets/css/ChatModule/message.css'
import { ChatTime } from '../../utility/Utility';

const Messages = ({ messages, name }) => (
    <ScrollToBottom className="messages-container">
        {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
    </ScrollToBottom>
);

const Message = ({ message: { text, user, created_at }, name }) => {
    let isSentByCurrentUser = false;
  
    const trimmedName = name.trim().toLowerCase();
  
    if(user === trimmedName) {
        isSentByCurrentUser = true;
    }
  
    return (
        isSentByCurrentUser? 
        (
            <div className="messageContainer justifyEnd">
                <span className="sentText pr-10">{ChatTime(created_at)}</span>
                <div className="messageBox backgroundBlue">
                    <span className="messageText colorWhite">{ReactEmoji.emojify(text)}</span>
                </div>
            </div>
        )
        : 
        (
            <div className="messageContainer justifyStart">
                <div className="messageBox backgroundLight">
                    <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                <span className="sentText pl-10 ">{ChatTime(created_at)}</span>
            </div>
          )
    );
  }

export default Messages;