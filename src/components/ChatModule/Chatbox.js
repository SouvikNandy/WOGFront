import React, { Component } from 'react'
import SocketInterface from '../../utility/SocketInterface'
import getUserData from '../../utility/userData'
import { generateId, getCurrentTimeInMS, isAuthenticated, retrieveFromStorage, saveInStorage } from '../../utility/Utility'
import InfoBar, { InfoImage } from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import '../../assets/css/ChatModule/chatbox.css'
import { GetChatRoomName, GetPreviousChats, StoreChat } from './chatUtils'

/* 
we are goin gto maintain a chatHistory in localstorage
ChatHistory will contain last 8 chat room details with last 10 chat messages of each room.
the structure is as follows

chatHistory : [
    {room: room1 , chats: [...last 10 messages]},
    {room: room2 , chats: [...last 10 messages]},
    ....
    store last 8 chat room records
]
*/


export class Chatbox extends Component {
    socket = null
    state ={
        sockRoom: '',
        sockUser: '',
        message: '',
        allMessage: [],
    }
    componentDidMount(){
        let sockRoom = null
        let sockUser = null
        if(isAuthenticated){
            sockUser= getUserData().username
            let allusers = [sockUser, this.props.chatBoxUser.username]
            sockRoom= GetChatRoomName(allusers)
            this.socket = new SocketInterface('chat')
            this.socket.joinRoom(sockUser, sockRoom,  (error) => {
                if(error) {
                    console.log("unable to join room on ns: chat")
                    }
                })
            this.socket.receiveMessage(message => {
                this.setState({allMessage : [ ...this.state.allMessage, message ]});
                StoreChat(message, this.state.sockRoom, this.props.chatBoxUser);
            });
            this.socket.roomUser(()=>{});
        }
        
        // retrieve previous messages
        let existingChats = GetPreviousChats(sockRoom, this.props.chatBoxUser)
        this.setState({
            sockUser: sockUser, sockRoom: sockRoom, allMessage: existingChats
        })
    }

    setMessage = (val) => {
        let messageBody = {user: this.state.sockUser, text: val, created_at: getCurrentTimeInMS(), id: generateId()};
        this.setState({ message: messageBody})
    }

    sendMessage = (event) => {
        event.preventDefault();
        if(this.state.message) {
            this.socket.sendMessage(this.state.message, () => {
                this.setState({message: ""});
            });
        }
    }

    storeInCache = (messageBody) =>{
        let chatHistory = JSON.parse( retrieveFromStorage('chatHistory'))
        if (chatHistory) {
            chatHistory.map(ele => {
                if(ele.room === this.state.sockRoom){
                    ele.chats.push(messageBody);
                    // console.log("chats length", ele.chats.length)
                    if(ele.chats.length > 10){
                        ele.chats = ele.chats.slice(-10)
                    }
                }
                return ele
            })
        }
        else{
            chatHistory = [{room: this.state.sockRoom , chats: [messageBody], otherUser: this.props.chatBoxUser} ]
        }
        saveInStorage("chatHistory", JSON.stringify(chatHistory))

    }

    componentWillUnmount() {
        // leave sock room
        if(this.socket) this.socket.leaveRoom(getUserData().username)
        if(this.props.onUnmount) this.props.onUnmount()
    }

    render() {
        return (
            <div className="chat-container">
                <InfoBar user={this.props.chatBoxUser} closeChat={this.props.closeChat} moveToOpenChats={this.props.moveToOpenChats}/>
                <Messages messages={this.state.allMessage} name={this.state.sockUser} />
                <Input message={this.state.message} setMessage={this.setMessage} sendMessage={this.sendMessage} />
            </div> 
        )
    }
}


export const OpenChatRecord =(props)=>{
    return(
        <React.Fragment>
            <InfoImage user={props.user} reOpenChat={props.reOpenChat} removeFromOpenChat={props.removeFromOpenChat}/>
        </React.Fragment>
    )
}
export default Chatbox
