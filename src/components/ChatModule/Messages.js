import React, { Component } from 'react';

import ScrollToBottom, {useObserveScrollPosition} from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';

import '../../assets/css/ChatModule/message.css'
import { ChatTime, getCurrentTimeInMS, SortByCreatedTimeASC } from '../../utility/Utility';

class Messages extends Component{
    render(){
        let messages = this.props.messages
        let name = this.props.name
        let is_seen = this.props.is_seen
        return(
            <ScrollToBottom className="messages-container">
            <MessagesContainer messages={messages} name={name} is_seen={is_seen} handleScroll={this.props.handleScroll}/>
            </ScrollToBottom>
        )
    }
}


const MessagesContainer = ({ messages, name, is_seen, handleScroll }) => {
    const observer = useObserveScrollPosition(handleScroll);
    return(
        <div useObserveScrollPosition={observer}>
            {messages.length < 1?
            <div className="empty-message"><span>Send hi, start a conversation</span></div>
            :""}
            {messages.sort(SortByCreatedTimeASC).map((message, i) => <div key={i}>{
                <React.Fragment>
                    <Message message={message} name={name} is_seen={is_seen}/>
                    {message.user === name && is_seen?
                        <span className="sentText seen-text">seen</span>
                        :
                        ""
                    }
                </React.Fragment>
                
                }</div>)}
        </div>

    )
    
}

const Message = ({ message: { text, user, created_at }, name, is_seen }) => {
    let isSentByCurrentUser = false;
  
    const trimmedName = name.trim().toLowerCase();
  
    if(user === trimmedName) {
        isSentByCurrentUser = true;
    }

    if(!text && !user){
        return(<div className="empty-message"><span>Send hi, start a conversation</span></div>)
    }
  
    return (
        isSentByCurrentUser? 
        (
            <React.Fragment>
                <div className="messageContainer justifyEnd">
                    <span className="sentText pr-10">{created_at?ChatTime(created_at): ChatTime(getCurrentTimeInMS())}</span>
                    <div className="messageBox backgroundBlue">
                        <span className="messageText colorWhite">{ReactEmoji.emojify(text)}</span>
                    </div>
                </div>

            </React.Fragment>
        )
        : 
        (
            <div className="messageContainer justifyStart">
                <div className="messageBox backgroundLight">
                    <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                <span className="sentText pl-10 ">{created_at?ChatTime(created_at): ChatTime(getCurrentTimeInMS())}</span>
            </div>
          )
    );
  }

export default Messages;