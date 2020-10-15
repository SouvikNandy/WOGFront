import React, { Component } from 'react';
import { getNotificationHandler } from '../../utility/userData';
import { FaRegPaperPlane } from "react-icons/fa";
import { generateId } from '../../utility/Utility';

export class ChatMainButton extends Component {
    state={
        unreadMsg: true,
        notificationHandler : getNotificationHandler(),
        handlerId: generateId()
    }
    componentDidMount(){
        // set initial state
        // if(this.props.pthName==="user-notifications"){
        //     this.setState({unreadMsg: false})
        // }
        // else{
        //     this.setState({unreadMsg: this.state.notificationHandler.isUnreadExists("CHAT")})
            
        // }
        // update on new message
        this.state.notificationHandler.registerCallbackList(this.state.handlerId, this.onNewMessage)
    }

    onNewMessage = (data) =>{
        if(data && data.key==="CHAT"){
            this.setState({unreadMsg: true})
        }
    }

    componentWillUnmount(){
        if(this.state.notificationHandler) this.state.notificationHandler.deregisterCallback(this.state.handlerId)
    }
    render() {
        return (
            <div className="chat-icon-div">
                <div className="chat-icon-circle" onClick={this.props.onClick}>
                    {this.state.unreadMsg? 
                        <div className="unread-icon"></div>
                        :
                        ""
                    }
                    <FaRegPaperPlane className="nav-icon" />
                </div>
                            
            </div>
        )
    }
}

export default ChatMainButton
