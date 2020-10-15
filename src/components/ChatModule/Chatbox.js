import React, { Component } from 'react'
import SocketInterface from '../../utility/SocketInterface'
import getUserData from '../../utility/userData'
import { getCurrentTimeInMS, isAuthenticated, retrieveFromStorage, saveInStorage } from '../../utility/Utility'
import InfoBar, { InfoImage } from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import '../../assets/css/ChatModule/chatbox.css'

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
            let allusers = [sockUser, this.props.chatBoxUser.username].sort()
            sockRoom= allusers.join(":")
            this.socket = new SocketInterface('chat')
            this.socket.joinRoom(sockUser, sockRoom,  (error) => {
                if(error) {
                    console.log("unable to join room on ns: chat")
                    }
                })
            this.socket.receiveMessage(message => {
                this.setState({allMessage : [ ...this.state.allMessage, message ]});
                this.storeInCache(message); 
            });
            this.socket.roomUser(()=>{});
        }
        
        // retrieve previous messages
        let chatHistory = []
        let existingChats = []

        if ('chatHistory' in localStorage){
            chatHistory = JSON.parse( retrieveFromStorage('chatHistory'))
        }
        if (chatHistory.length> 0){
            let targetRoom = chatHistory.filter(ele => ele.room === sockRoom)[0]
            if (targetRoom){
                let targetIndex = chatHistory.findIndex(ele => ele.room === sockRoom)
                existingChats = targetRoom.chats
                chatHistory.splice(targetIndex, 1)
                chatHistory.unshift({room: sockRoom , chats: existingChats, otherUser: this.props.chatBoxUser})

            }
            else{
                chatHistory.unshift({room: sockRoom , chats: [], otherUser: this.props.chatBoxUser})
            }
        }
        else{
            chatHistory = [{room: sockRoom , chats: [], otherUser: this.props.chatBoxUser}]
        }
        if (chatHistory.length > 8){
            chatHistory = chatHistory.slice(0, 8)
        }
        // save in localstorage
        saveInStorage("chatHistory", JSON.stringify(chatHistory))
        // console.log("existingChats", existingChats)

        this.setState({
            sockUser: sockUser, sockRoom: sockRoom, allMessage: existingChats
        })
    }

    setMessage = (val) => {
        console.log("set message called")
        let messageBody = {user: this.state.sockUser, text: val, created_at: getCurrentTimeInMS()};
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
