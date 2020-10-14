import React, { Component } from 'react';
import { getNotificationHandler } from '../../utility/userData';
import { FaRegPaperPlane } from "react-icons/fa";

export class ChatMainButton extends Component {
    state={
        unreadMsg: true,
        notificationHandler : getNotificationHandler()
    }
    componentDidMount(){
        // set initial state
        // if(this.props.pthName==="user-notifications"){
        //     this.setState({unreadMsg: false})
        // }
        // else{
        //     this.setState({unreadMsg: this.state.notificationHandler.isUnreadExists("CHAT")})
            
        // }
        // update on new notification
        this.state.notificationHandler.registerCallbackList(this.onNewMessage)
    }

    onNewMessage = (data) =>{
        if(data && data.key==="CHAT"){
            this.setState({unreadMsg: true})
        }

    }


    componentWillUnmount(){
        // if(this.state.notificationHandler) this.state.notificationHandler.deregisterCallback()
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
