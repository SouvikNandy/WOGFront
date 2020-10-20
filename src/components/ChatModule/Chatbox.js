import React, { Component } from 'react'
import SocketInterface from '../../utility/SocketInterface'
import getUserData from '../../utility/userData'
import { generateId, getCurrentTimeInMS, isAuthenticated } from '../../utility/Utility'
import InfoBar, { InfoImage } from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import '../../assets/css/ChatModule/chatbox.css'
import { AppendChatBlock, GetChatRoomName, GetPreviousChats, GetRoomTextPaginator, SetRoomTextPaginator, StoreChat, StoreChatBlock, UpdateSeenChat } from './chatUtils'
import { RoomMessagesAPI } from '../../utility/ApiSet'
import Paginator from '../../utility/Paginator'

/* 
we are goin gto maintain a chatHistory in localstorage
ChatHistory will contain last 8 chat room details with last 10 chat messages of each room.
the structure is as follows

chatHistory : [
    {room: room1 , chats: [...last 10 messages]},
    {room: room2 , chats: [...last 10 messages]},
    ....
]
*/


export class Chatbox extends Component {
    socket = null
    state ={
        sockRoom: '',
        sockUser: '',
        message: '',
        allMessage: [],
        is_seen: false,
        paginator: null,
        isFetching: false,
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
                if ('seen_alert' in message){
                    // update room as seen
                    UpdateSeenChat(message["room"])
                    this.setState({is_seen: true})

                }
                else{
                    let is_seen = false
                    message.seen_by.map(ele=> {
                        if(ele===this.props.chatBoxUser.username){
                            is_seen = true
                        }
                        return ele
                    })
                    this.setState({allMessage : [ ...this.state.allMessage, message ], is_seen: is_seen});
                    StoreChat(message, sockRoom, this.props.chatBoxUser, message.seen_by, message.last_updated);
                }
                
            });
            this.socket.roomUser(()=>{});
        }
        
        // retrieve previous messages
        /*
        if room text fetched from backend with in last 15 minutes(900 seconds) then fetch data from cache 
        else fetch and store from backend 
        */
       let rommPaginator = GetRoomTextPaginator(sockRoom)
       let currTime = getCurrentTimeInMS()
       if (!rommPaginator || !rommPaginator.last_updated || currTime - rommPaginator.last_updated >=900){
            RoomMessagesAPI(sockRoom, this.UpdateOnAPICall.bind(this, sockRoom, sockUser))
       }
       else{
            let [existingChats, seen_by] = GetPreviousChats(sockRoom, this.props.chatBoxUser)

            this.setState({
                sockUser: sockUser, sockRoom: sockRoom, allMessage: existingChats, seen_by: seen_by, paginator: rommPaginator.paginator
            })

        }
    }

    UpdateOnAPICall = (sockRoom, sockUser, data) =>{
        // paginated response
        let paginator = data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        this.setState({
            sockUser: sockUser, 
            sockRoom: sockRoom,
            allMessage: data.results,
            seen_by: data.seen_by,
            paginator: paginator
        })
        SetRoomTextPaginator(sockRoom, paginator)
        let chatBlock = {room: sockRoom , chats: data.results, otherUser: data.otherUser, seen_by: data.seen_by, last_updated: data.last_updated}
        StoreChatBlock(chatBlock)
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
    
    handleScroll = (e) =>{
        // console.log(" handleScroll called ", e.scrollTop)
        if(e.scrollTop !== 0) return;
        if(this.state.isFetching) return;
        if(this.state.paginator && this.state.paginator.next){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination, false)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
    }
    updateStateOnPagination = (data) =>{
        let newMessageList = [...this.state.allMessage, ...data.results]
        this.setState({
            allMessage: newMessageList,
            isFetching: false
        })
        AppendChatBlock(this.state.sockRoom, newMessageList)
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
                <Messages messages={this.state.allMessage} name={this.state.sockUser} is_seen={this.state.is_seen} handleScroll={this.handleScroll}/>
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
