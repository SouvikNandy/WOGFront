import React, { Component } from 'react'
import SocketInterface from '../../utility/SocketInterface'
import getUserData from '../../utility/userData'
import { getCurrentTimeInMS, isAuthenticated } from '../../utility/Utility'
import InfoBar, { InfoImage } from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import '../../assets/css/ChatModule/chatbox.css'

export class Chatbox extends Component {
    socket = null
    state ={
        sockRoom: '',
        sockUser: '',
        message: '',
        allMessage: []
    }
    componentDidMount(){
        let sockRoom = null
        let sockUser = null
        if(isAuthenticated){
            sockUser= getUserData().username
            let allusers = [sockUser, this.props.chatBoxUser.username].sort()
            sockRoom= allusers.join("_")
            this.socket = new SocketInterface('chat')
            this.socket.joinRoom(sockUser, sockRoom,  (error) => {
                if(error) {
                    console.log("unable to join room on ns: chat")
                    }
                })
            this.socket.receiveMessage(message => {
                this.setState({allMessage : [ ...this.state.allMessage, message ]});
            });
            this.socket.roomUser(()=>{});
        }
        this.setState({
            sockUser: sockUser, sockRoom: sockRoom
        })
    }

    setMessage = (val) => this.setState({ message: {text: val, created_at: getCurrentTimeInMS()}})

    sendMessage = (event) => {
        event.preventDefault();
        if(this.state.message) {
            this.socket.sendMessage(this.state.message, () => {
                this.setState({message: ""})
            });
        }
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
