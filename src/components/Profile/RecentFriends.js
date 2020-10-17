import React, { Component } from 'react';
import getUserData, { getNotificationHandler, UserRecentFriends } from '../../utility/userData';
import OwlLoader from '../OwlLoader';
import { SearchOnFriendsAPI } from '../../utility/ApiSet';
import { UserFlat } from './UserView';
import SearchBar from '../Search/SearchBar';
import '../../assets/css/discoverPeople.css';
import '../../assets/css/ChatModule/chatbox.css'
import { FiArrowRightCircle, FiSearch } from 'react-icons/fi';
import Chatbox, { OpenChatRecord } from '../ChatModule/Chatbox';
import { ChatTime, generateId, getCurrentTimeInMS, retrieveFromStorage } from '../../utility/Utility';
import { FaShare } from 'react-icons/fa';
import { GetOpenChats, StoreChat, UpdateOpenChat } from '../ChatModule/chatUtils';

export class RecentFriends extends Component {
    state = {
        allFriends: null,
        totalFriendsCount: 0,
        output: [],
        lastSearched: null,
        lastSearchedCount: 0,
        showChatBox: false,
        chatBoxUser: null,
        openChats: [],
        // make sure it is registered first among other places listning chat
        notificationHandler : null,
        handlerId: generateId()
    }
    
    componentDidMount(){
        UserRecentFriends(this.updateStateOnAPIcall);  
    }
    
    moveToOpenChats = (ele) => {
        // keep last 8 open chat records
        // to track unread messages
        ele.is_unread= false
        let newOpenChat = [ele, ...this.state.openChats];
        if (newOpenChat.length> 8) {
            newOpenChat.slice(0, 8)
        }

        this.setState({openChats: newOpenChat, showChatBox:false, chatBoxUser: null});
        UpdateOpenChat(newOpenChat);
    }
        
    removeFromOpenChat = (ele) => {
        let newOpenChat = this.state.openChats.filter(item=> item.username!== ele.username)
        this.setState({openChats: newOpenChat});
        UpdateOpenChat(newOpenChat);
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        let notificationHandler= getNotificationHandler()
        this.setState({
            allFriends: data.results,
            totalFriendsCount: data.totalFriends,
            output: data.results,
            openChats: GetOpenChats(),
            notificationHandler: notificationHandler
        })
        notificationHandler.registerCallbackList(this.state.handlerId, this.onNewNotification);
    }

    onNewNotification = (data) =>{
        console.log("onNewNotification called", data)
        if(data && data.key==="CHAT"){
            let newOpenChat = this.state.openChats
            newOpenChat.map(ele=> {
                if(ele.username===data.data.user){
                    ele.is_unread = true;
                }
                return ele
            })
            let sockRoom = data.data.room
            let userDetails = data.data.user_details
            delete data.data.room
            delete data.data.user_details

            StoreChat(data.data, sockRoom, userDetails, false)
            this.setState({openChats: newOpenChat})
            UpdateOpenChat(newOpenChat);
        }
    }

    updateChatboxState = (chatUser=null) =>{
        let showChatBox = !this.state.showChatBox;
        let openChats = this.state.openChats
        if(showChatBox){
            openChats = this.state.openChats.filter(ele => ele.username!==chatUser.username)
            UpdateOpenChat(openChats);
        }
        this.setState({
            showChatBox: !this.state.showChatBox,
            chatBoxUser: chatUser,
            openChats: openChats
        })

    }

    findFriends = (value) =>{
        let phase = value.toLowerCase();
        if(!phase){
            // show last filtered results
            this.setState({
                output: this.state.allFriends
            })
            return true
        }

        let matchedRecords = this.state.allFriends.filter(item => 
            (item.name.toLowerCase().startsWith(phase) || item.username.toLowerCase().startsWith(phase))
            );

        if (this.state.totalFriendsCount <= this.state.allFriends.length ){
            this.setState({
                output: [...matchedRecords],
                lastSearched: phase
            })
        }

        else if (this.state.lastSearched && phase.includes(this.state.lastSearched) && phase.length > this.state.lastSearched.length){            
            // check if matched records found. if not searched with the new term
            if(matchedRecords.length < this.state.lastSearchedCount ){
                // search with new term
                this.searchFromAPI(phase)
            }
        }
        else{
            this.searchFromAPI(phase)
        }
    }

    searchFromAPI = (searchKey) =>{
        SearchOnFriendsAPI(searchKey, this.ShowSearchedResult.bind(this, searchKey))
    }

    ShowSearchedResult = (searchKey, data) =>{
        let prevUsernames = this.state.allFriends.map(ele => ele.username)
        let dataset = data.results.filter(ele=> !prevUsernames.includes(ele.username))
        this.setState({
            allFriends: [...this.state.allFriends, ...dataset],
            output: data.results,
            lastSearched: searchKey,
            lastSearchedCount: data.count
        })
    }

    render() {
        if(!this.state.allFriends) return(<React.Fragment><OwlLoader /></React.Fragment>)
        return (
            <React.Fragment>
                <div className="friends-search">
                    <SearchBar className="srch-bar" searchPlaceHolder={"Search friends ..."} 
                    focusSearchBar ={false}
                    searchOnChange={this.findFriends}/>
                    <FiSearch className="icons search-icon" />
                </div>
            
                <div className="new-friends-container">
                    {this.state.output.map(ele =>{
                        return(
                            <div className="discover-list" key={ele.username} onClick={this.updateChatboxState.bind(this, ele)}>
                                <UserFlat data={ele} redirectPage={false}/>
                            </div>
                        )}
                        
                    )}

                    {this.state.showChatBox?
                        <div className="chat-short">
                            <Chatbox chatBoxUser={this.state.chatBoxUser} moveToOpenChats={this.moveToOpenChats.bind(this, this.state.chatBoxUser)} 
                            closeChat={this.updateChatboxState}/>
                        </div>
                    
                        :
                        ""
                    }
                    {this.state.openChats.length > 0?
                        <div className="open-chats">
                            {this.state.openChats.map(ele =>{
                                return (
                                    <OpenChatRecord key={ele.username} user={ele} 
                                    reOpenChat={this.updateChatboxState.bind(this, ele)} 
                                    removeFromOpenChat={this.removeFromOpenChat.bind(this, ele)}
                                    />
                                )
                            })}

                        </div>
                        :
                        ""
                    }

                </div>
                
            </React.Fragment>
        )
    }
}

export class RecentChats extends Component{
    state = {
        allChats: null,
        totalFriendsCount: 0,
        output: [],
        lastSearched: null,
        lastSearchedCount: 0,
        showChatBox: false,
        chatBoxUser: null,
        currUser : getUserData().username,
    }
    
    componentDidMount(){
        // check on chat history. if chat history exists and chethistory length == 10 then call backend api
        let chatHistory = JSON.parse( retrieveFromStorage('chatHistory'))
        if(chatHistory && chatHistory.length < 10){
            this.setState({
                allChats: chatHistory,
                totalFriendsCount: chatHistory.length,
                output: chatHistory
            })
        }
        else{
            // get user recent chats
            UserRecentFriends(this.updateStateOnAPIcall);
        }
        
    }
    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            allChats: data.results,
            totalFriendsCount: data.totalFriends,
            output: data.results
        })
    }

    updateChatboxState = (chatUser=null) =>{
        this.setState({
            showChatBox: !this.state.showChatBox,
            chatBoxUser: chatUser,
        })
    }

    findFriends = (value) =>{
        let phase = value.toLowerCase();
        if(!phase){
            // show last filtered results
            this.setState({
                output: this.state.allChats
            })
            return true
        }

        let matchedRecords = this.state.allChats.filter(item => 
            (item.name.toLowerCase().startsWith(phase) || item.username.toLowerCase().startsWith(phase))
            );

        if (this.state.totalFriendsCount <= this.state.allChats.length ){
            this.setState({
                output: [...matchedRecords],
                lastSearched: phase
            })
        }

        else if (this.state.lastSearched && phase.includes(this.state.lastSearched) && phase.length > this.state.lastSearched.length){            
            // check if matched records found. if not searched with the new term
            if(matchedRecords.length < this.state.lastSearchedCount ){
                // search with new term
                this.searchFromAPI(phase)
            }
        }
        else{
            this.searchFromAPI(phase)
        }
    }

    searchFromAPI = (searchKey) =>{
        SearchOnFriendsAPI(searchKey, this.ShowSearchedResult.bind(this, searchKey))
    }

    ShowSearchedResult = (searchKey, data) =>{
        let prevUsernames = this.state.allChats.map(ele => ele.username)
        let dataset = data.results.filter(ele=> !prevUsernames.includes(ele.username))
        this.setState({
            allChats: [...this.state.allChats, ...dataset],
            output: data.results,
            lastSearched: searchKey,
            lastSearchedCount: data.count
        })
    }

    ReloadChats = (room, record)=>{
        let chatHistory = JSON.parse( retrieveFromStorage('chatHistory'))
        if(chatHistory){
            this.setState({
                allChats: chatHistory,
                totalFriendsCount: chatHistory.length,
                output: chatHistory
            })
        }

    }

    render(){
        return(
            <React.Fragment>
                <div className="messagebox-head">
                    <div className="dark-overlay"></div>
                    <div className="header-conatiner">
                        <FiArrowRightCircle className="close-btn" onClick={this.props.onClose.bind(this, {sureVal: false})}/>   
                        <span className="title-text">Messages</span>
                    </div>
                    
                    <a href="https://www.pexels.com/photo/assorted-map-pieces-2859169/" className="link img-credits">
                    Shot by <span className="contributor-name">Andrew Neel</span>
                    </a>
                    <div className="friends-search">
                        <SearchBar className="srch-bar" searchPlaceHolder={"Search friends ..."} 
                        focusSearchBar ={false}
                        searchOnChange={this.findFriends}/>
                        <FiSearch className="icons search-icon" />
                    </div>

                </div>
                

                <div className="new-friends-container chat-user-container">
                    {this.state.output.map(ele =>{
                        let chatEle = ele.chats[ele.chats.length -1]
                        let created_at = chatEle? chatEle.created_at : getCurrentTimeInMS()
                        let altText = ""
                        if (!chatEle){
                            altText = <span className="suggested-text">Send hi, start a conversation</span>
                        }
                        else if(chatEle.user===this.state.currUser){
                            altText = <span className="sent-text"><FaShare className="self-sent"/> {chatEle.text}</span>
                        }
                        else{
                            altText = <span className="sent-text">{chatEle.text}</span>
                        }

                        return(
                            <div className="discover-list" key={ele.otherUser.id} onClick={this.updateChatboxState.bind(this, ele.otherUser)}>
                                <UserFlat data={ele.otherUser} redirectPage={false} tagText={altText}/>
                                <span className="chat-time">{ChatTime(created_at)}</span>
                            </div>
                        )}
                        
                    )}
                    {this.state.showChatBox?
                        <div className="chat-short chat-full-length">
                            <Chatbox chatBoxUser={this.state.chatBoxUser}
                            closeChat={this.props.onClose.bind(this, {sureVal: false})} 
                            moveToOpenChats={this.updateChatboxState}
                            onUnmount={this.ReloadChats}
                            />
                        </div>
                    
                        :
                        ""
                    }
                </div>

            </React.Fragment>
        )
    }

}

export default RecentFriends