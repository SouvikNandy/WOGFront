import React, { Component } from 'react';

import ScrollToBottom, {useObserveScrollPosition} from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';

import '../../assets/css/ChatModule/message.css'
import { BinaryToBlob, ChatTime, getCurrentTimeInMS, SortByCreatedTimeASC } from '../../utility/Utility';

class Messages extends Component{
    render(){
        let messages = this.props.messages
        let name = this.props.name
        let is_seen = this.props.is_seen
        return(
            <ScrollToBottom className="messages-container">
            <MessagesContainer messages={messages} name={name} is_seen={is_seen} handleScroll={this.props.handleScroll} 
                viewImageFullSize={this.props.viewImageFullSize}
                />
            </ScrollToBottom>
        )
    }
}


const MessagesContainer = ({ messages, name, is_seen, handleScroll, viewImageFullSize }) => {
    const observer = useObserveScrollPosition(handleScroll);
    let lastTextUser = messages.length < 1?"": messages[messages.length -1].user
    return(
        <div useObserveScrollPosition={observer}>
            {messages.length < 1?
            <div className="empty-message"><span>Send hi, start a conversation</span></div>
            :""}
            {messages.sort(SortByCreatedTimeASC).map((message, i) => <div key={i}>{
                <React.Fragment>
                    <Message message={message} name={name} is_seen={is_seen} viewImageFullSize={viewImageFullSize}/>
                    
                </React.Fragment>
                
                }</div>)}
                {lastTextUser === name && is_seen?
                        <span className="sentText seen-text">seen</span>
                        :
                        ""
                    }
        </div>

    )
    
}

const Message = ({ message, name, is_seen, viewImageFullSize }) => {
    let text = message.text
    let user = message.user
    let created_at = message.created_at
    let isSentByCurrentUser = false;
  
    const trimmedName = name.trim().toLowerCase();
  
    if(user === trimmedName) {
        isSentByCurrentUser = true;
    }

    if(!text && !user){
        return(<div className="empty-message"><span>Send hi, start a conversation</span></div>)
    }
    
    let messageBoxPrefix = message.attachment?" messageBox-transaparent": ""
    let messageTextPrefix = message.attachment && text? isSentByCurrentUser?" messageText-Highlight backgroundBlue": " messageText-Highlight backgroundLight": ""
    return (
        isSentByCurrentUser? 
        (
            <React.Fragment>
                <div className="messageContainer justifyEnd">
                    <span className="sentText pr-10">{created_at?ChatTime(created_at): ChatTime(getCurrentTimeInMS())}</span>
                    <div className={"messageBox backgroundBlue"+messageBoxPrefix}>
                        {message.attachment?

                        <img className="messageImg" 
                        alt="" src={URL.createObjectURL(BinaryToBlob(message.attachment, message.attachmentType))}
                        onClick={()=>viewImageFullSize(message.attachment, message.attachmentType) }
                        />:""
                        }
                        <span className={"messageText colorWhite"+messageTextPrefix}>{ReactEmoji.emojify(text)}</span>
                    </div>
                </div>

            </React.Fragment>
        )
        : 
        (
            <div className="messageContainer justifyStart">
                <div className={"messageBox backgroundLight"+messageBoxPrefix}>
                    {message.attachment?
                        <img className="messageImg" 
                        alt="" src={URL.createObjectURL(BinaryToBlob(message.attachment, message.attachmentType))}
                        onClick={()=>viewImageFullSize(message.attachment, message.attachmentType)}
                        />:""
                    }
                    <p className={"messageText colorDark"+messageTextPrefix}>{ReactEmoji.emojify(text)}</p>
                </div>
                <span className="sentText pl-10 ">{created_at?ChatTime(created_at): ChatTime(getCurrentTimeInMS())}</span>
            </div>
          )
    );
  }

export default Messages;