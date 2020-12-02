import React, { Component } from 'react';
import { getNotificationHandler } from '../../utility/userData';
import { FaRegPaperPlane } from "react-icons/fa";
import { generateId } from '../../utility/Utility';
import { GetOpenChats } from './chatUtils';
import { CheckIfUnreadChats } from '../../utility/ApiSet';
import { Context } from '../../GlobalStorage/Store';

export class ChatMainButton extends Component {
    static contextType = Context
    state={
        unreadMsg: false,
        notificationHandler : getNotificationHandler(),
        handlerId: generateId()
    }
    componentDidMount(){
        // check if unread chat exists
        CheckIfUnreadChats(this.InitialAPICall)
        // update on new message
        this.state.notificationHandler.registerCallbackList(this.state.handlerId, this.onNewMessage)
    }

    InitialAPICall = (data) =>{
        this.setState({unreadMsg: data.data})
    }

    onNewMessage = (data) =>{
        // console.log("onNewMessage called", data)
        if(data && data.key==="CHAT"){
            // if chat is not opnchat then only turn it as true
            let openChats= GetOpenChats();
            let userActive = openChats.filter(ele=> ele.username===data.data.user)[0]
            if (!userActive){
                this.setState({unreadMsg: true})
                // store received data
                let sockRoom = data.data.room
                let userDetails = data.data.user_details
                let last_updated = data.data.last_updated
                let seen_by = data.data.seen_by 
                delete data.data.room
                delete data.data.user_details
                delete data.data.last_updated
                delete data.data.seen_by

                let roomData = this.context[0][sockRoom]
                if( roomData){
                    roomData.chats = data.data 
                    roomData.seen_by.concat(seen_by)
                    roomData.last_updated = last_updated
                    // update global data
                    this.updateGlobalChatRoomData(roomData)
                }
                else{
                    let initialRecord = {room: sockRoom , chats: [data.data], otherUser: userDetails, seen_by: seen_by, last_updated: last_updated}
                    this.updateGlobalChatRoomData(initialRecord)
                }
            }
        }
    }

    updateGlobalChatRoomData = (data) =>{
        const dispatch = this.context[1]
        dispatch({type: 'SET_CHATROOM', payload: data });
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
