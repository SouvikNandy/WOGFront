import React, { Component } from 'react'
import SocketInterface from '../../utility/SocketInterface'
import getUserData from '../../utility/userData'
import { BinaryToBlob, checkNotEmptyObject, convertImagetoBinary, generateId, getCurrentTimeInMS, isAuthenticated } from '../../utility/Utility'
import InfoBar, { InfoImage } from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import '../../assets/css/ChatModule/chatbox.css'
import { GetChatRoomName, GetRoomTextPaginator, SetRoomTextPaginator } from './chatUtils'
import { RoomMessagesAPI } from '../../utility/ApiSet'
import Paginator from '../../utility/Paginator'
import ImgCompressor from '../../utility/ImgCompressor'
import { Context } from '../../GlobalStorage/Store'

/* 
we are going to maintain a chatHistory in localstorage
ChatHistory will contain last 8 chat room details with last 10 chat messages of each room.
the structure is as follows

chatHistory : [
    {room: room1 , chats: [...last 10 messages]},
    {room: room2 , chats: [...last 10 messages]},
    ....
]
*/


export class Chatbox extends Component {
    static contextType = Context
    socket = null
    state ={
        sockRoom: '',
        sockUser: '',
        message: '',
        attachmentAddReq : false,
        attachment: null,
        attachmentType: null,
        allMessage: [],
        is_seen: false,
        paginator: null,
        isFetching: false,

        // to show full size image
        showInputBox: true
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
                    this.UpdateSeenChat(message["room"], message["seen_by"])
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

                    let updatedMessaes = [ ...this.state.allMessage, message ]
                    let seen_by = message.seen_by
                    
                    this.setState({allMessage : [ ...this.state.allMessage, message ], is_seen: is_seen});
                    
                    // update global data
                    let roomData = this.context[0][sockRoom]
                    if( roomData){
                        roomData.chats = updatedMessaes 
                        roomData.seen_by.concat(seen_by)
                        roomData.last_updated = getCurrentTimeInMS()
                        // update global data
                        // console.log("received",this.props.chatBoxUser.username,  is_seen, roomData.seen_by)
                        this.updateGlobalChatRoomData(roomData)
                    }
                
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
            // console.log("Call from Backend")
       }
       else{
            let prevChatRecord = this.context[0][sockRoom]
            let existingChats = []
            let seen_by = []
            if(checkNotEmptyObject(prevChatRecord)){
                existingChats = prevChatRecord.chats
                seen_by = prevChatRecord.seen_by
            }
            
            // console.log("Call from previous chat", prevChatRecord)

            this.setState({
                sockUser: sockUser, sockRoom: sockRoom, allMessage: existingChats, 
                // seen_by: seen_by, 
                is_seen: seen_by.filter(ele=> ele!==sockUser).length> 0? true : false,
                paginator: rommPaginator.paginator
            })

        }
    }


    UpdateOnAPICall = (sockRoom, sockUser, data) =>{
        // paginated response
        let paginator = data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        // console.log("data",data.seen_by, data.seen_by.filter(ele=> ele!==sockUser).length> 0? true : false)
        this.setState({
            sockUser: sockUser, 
            sockRoom: sockRoom,
            allMessage: data.results,
            // seen_by: data.seen_by,
            is_seen: data.seen_by.filter(ele=> ele!==sockUser).length> 0? true : false,
            paginator: paginator
        })
        SetRoomTextPaginator(sockRoom, paginator)
        let chatBlock = {room: sockRoom , chats: data.results, otherUser: data.otherUser, seen_by: data.seen_by, last_updated: data.last_updated}

        // store initial data in chatroom
        this.updateGlobalChatRoomData(chatBlock)

    }

    UpdateSeenChat = (room, seen_by) =>{
        let roomData = this.context[0][room]
        if( roomData && !roomData.chats[roomData.chats.length -1].seen_by.includes(seen_by) ){
            roomData.seen_by.concat(seen_by)
            // update global data
            this.updateGlobalChatRoomData(roomData)
            
        }

    }

    updateGlobalChatRoomData = (data) =>{
        const dispatch = this.context[1]
        dispatch({type: 'SET_CHATROOM', payload: data });
    }

    setMessage = (val) => {
        // console.log("setMessage called")
        let messageBody = {user: this.state.sockUser, text: val,  created_at: getCurrentTimeInMS(), id: generateId()};
        this.setState({ message: messageBody})
    }

    addAttachment = (e) =>{
        ImgCompressor(e, this.updateAttachment, null, false)
    }

    updateAttachment = (compressedFile) =>{
        // console.log("compressedFile", compressedFile)
        this.setState({attachmentAddReq: true, attachmentType: compressedFile.type})
        convertImagetoBinary(compressedFile, this.updateStateOnAttachmentAddition)
    }

    updateStateOnAttachmentAddition =(binaryVal) =>{
        // console.log("binaryval",binaryVal)
        this.setState({
            attachment: binaryVal,
            
            message: this.state.message? this.state.message: {user: this.state.sockUser, text: "",  created_at: getCurrentTimeInMS(), id: generateId()}
        });

    }
    removeAttachment = ()=>{
        this.setState({
            attachment: null,
            attachmentType: null,
            attachmentAddReq: false,
            showInputBox: true
        });
    }

    viewImageFullSize = (attachement, attachmentType) =>{
        // set attachment
        this.setState({
            attachment: attachement,
            attachmentType: attachmentType,
            attachmentAddReq: true,
            showInputBox: false
        });
    }

    sendMessage = (event) => {
        event.preventDefault();
        if (this.state.attachment){
            
        }
        if(this.state.message) {
            let message = this.state.message
            message.attachment = this.state.attachment
            message.attachmentType = this.state.attachmentType
            
            this.socket.sendMessage(message, () => {
                this.setState({message: "", attachment: null, attachmentType: null, attachmentAddReq: false});
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
        const dispatch = this.context[1]
        dispatch({type: 'ADD_RECORD_TO_CHATROOM', payload: {room: this.state.sockRoom, chats: data.results} });
    }

    componentWillUnmount() {
        // leave sock room
        if(this.socket) this.socket.leaveRoom(getUserData().username)
        let roomData = this.context[0][this.state.sockRoom]
        if(this.props.onUnmount && roomData) {
            let ourData = {...roomData}
            ourData.chats = [roomData.chats[roomData.chats.length -1]]
            this.props.onUnmount(this.state.sockRoom, ourData)
        }
    }

    render() {
        return (
            <div className="chat-container">
                <InfoBar user={this.props.chatBoxUser} closeChat={this.props.closeChat} moveToOpenChats={this.props.moveToOpenChats}/>
                {this.state.attachmentAddReq && this.state.attachment?
                    <ImageUploadView fileObj={this.state.attachment} fileType={this.state.attachmentType} removeAttachment={this.removeAttachment}/>
                :
                    <Messages messages={this.state.allMessage} name={this.state.sockUser} is_seen={this.state.is_seen} 
                    handleScroll={this.handleScroll} viewImageFullSize={this.viewImageFullSize}/>
                }
                
                {this.state.showInputBox?
                    <Input message={this.state.message} setMessage={this.setMessage} sendMessage={this.sendMessage} 
                    addAttachment={this.state.attachmentAddReq?false: this.addAttachment}/>
                    :
                    ""
                }
                
            </div> 
        )
    }
}


const ImageUploadView = (props)=>{
    // console.log("fileObj",props.fileObj)
    return(
        <div className="chat-attachment-preview">
            <div className="remove-attach-img" onClick={props.removeAttachment}>close</div>
            <img className="chat-attach-img" alt="" src={URL.createObjectURL(BinaryToBlob(props.fileObj, props.fileType) )} />
        </div>
    )
}

export const OpenChatRecord =(props)=>{
    return(
        <React.Fragment>
            <InfoImage user={props.user} reOpenChat={props.reOpenChat} removeFromOpenChat={props.removeFromOpenChat}/>
        </React.Fragment>
    )
}
export default Chatbox
