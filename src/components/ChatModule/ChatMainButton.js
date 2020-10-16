import React, { Component } from 'react';
import { getNotificationHandler } from '../../utility/userData';
import { FaRegPaperPlane } from "react-icons/fa";
import { generateId } from '../../utility/Utility';
import { GetOpenChats, StoreChat } from './chatUtils';

export class ChatMainButton extends Component {
    state={
        unreadMsg: false,
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
        console.log("onNewMessage called", data)
        if(data && data.key==="CHAT"){
            // if chat is not opnchat then only turn it as true
            let openChats= GetOpenChats();
            let userActive = openChats.filter(ele=> ele.username===data.data.user)[0]
            if (!userActive){
                this.setState({unreadMsg: true})
                // store received data
                let sockRoom = data.data.room
                let userDetails = data.data.user_details
                delete data.data.room
                delete data.data.user_details

                StoreChat(data.data, sockRoom, userDetails)
            }

            
        }
    }

    showHideMessageBox = ()=>{
        this.setState({
            unreadMsg: false,
        })
        this.props.onClick();
    }

    componentWillUnmount(){
        if(this.state.notificationHandler) this.state.notificationHandler.deregisterCallback(this.state.handlerId)
    }
    render() {
        return (
            <div className="chat-icon-div">
                <div className="chat-icon-circle" onClick={this.showHideMessageBox}>
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
