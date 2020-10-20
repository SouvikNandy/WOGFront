import React, { Component } from 'react';
import getUserData, { getNotificationHandler, UserRecentFriends } from '../../utility/userData';
import OwlLoader from '../OwlLoader';
import { ChatListAPI, SearchOnChatListAPI, SearchOnFriendsAPI } from '../../utility/ApiSet';
import { UserFlat } from './UserView';
import SearchBar from '../Search/SearchBar';
import '../../assets/css/discoverPeople.css';
import '../../assets/css/ChatModule/chatbox.css'
import { FiArrowRightCircle, FiSearch } from 'react-icons/fi';
import Chatbox, { OpenChatRecord } from '../ChatModule/Chatbox';
import { ChatTime, generateId, GetCookie, retrieveFromStorage, saveInStorage, SetCookie, SortByUpdatedTimeDESC } from '../../utility/Utility';
import { FaShare } from 'react-icons/fa';
import { GetChatHistory, GetOpenChats, StoreChat, UpdateOpenChat, GetChatHistoryPaginator, SetChatHistoryPaginator, GetChatRoomName } from '../ChatModule/chatUtils';
import Paginator from '../../utility/Paginator';

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
        // console.log("onNewNotification called", data)
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
            let last_updated = data.data.last_updated
            let seen_by = data.data.seen_by 
            delete data.data.room
            delete data.data.user_details
            delete data.last_updated
            delete data.seen_by

            StoreChat(data.data, sockRoom, userDetails, seen_by, last_updated)
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
        output: [],
        paginator: null,
        isFetching: false,
        lastSearched: null,
        lastSearchedCount: 0,
        showChatBox: false,
        chatBoxUser: null,
        currUser : getUserData().username,
        notificationHandler : getNotificationHandler(),
        handlerId: generateId()
    }
    
    componentDidMount(){

        let chatpaginator = GetChatHistoryPaginator()
        let chatHistory = GetChatHistory()

        let cookieFound = GetCookie("chatListExist")
        // console.log(chatpaginator, chatHistory.length, cookieFound)
        if(!cookieFound|| !chatpaginator.last_updated){
            ChatListAPI(this.updateStateOnAPIcall);
        }

        else if (!chatpaginator.last_updated && !chatHistory.length>0) {
            ChatListAPI(this.updateStateOnAPIcall);
        }
        else{
            this.setState({
                allChats: chatHistory,
                output: chatHistory,
                paginator: chatpaginator.paginator
            })
        
        }
        this.state.notificationHandler.registerCallbackList(this.state.handlerId, this.onNewMessage)
    }

    onNewMessage = (data) =>{
        if(data && data.key==="CHAT"){
            // console.log("RecentChats onNewMessage called", data)
            if (data.key === "CHAT"){
                let roomName = GetChatRoomName([this.state.currUser, data.data.user])
                console.log(this.state.allChats)
                this.setState({
                    allChats: this.state.allChats.map(ele=> {
                        if(ele.room === roomName){
                            ele.chats.push(data.data)
                        }
                        return ele
                    })
                })

            } 
        }
    }
    updateStateOnAPIcall = (data)=>{
        // paginated response
        let paginator = data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        this.setState({
            allChats: data.results,
            output: data.results,
            paginator: paginator
        })
        SetChatHistoryPaginator(paginator)
        this.maintainCache(data.results)
        SetCookie("chatListExist", 'true', 15)
    }

    maintainCache = (recordset) =>{
        let chatHistory = JSON.parse(retrieveFromStorage("chatHistory"))
        let prevChatLength = {}
        chatHistory.map(ele=>{
            prevChatLength[ele.room] = ele.chats.length
            return ele
        })

        recordset.map(ele=>{
            if(ele.room in prevChatLength && prevChatLength[ele.room]> ele.chats.length){
                ele.chats = chatHistory.filter(item => item.room ===ele.room)[0].chats
            }
            return ele
        })
        saveInStorage("chatHistory", JSON.stringify(recordset))
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator && this.state.paginator.next){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            allChats:[...this.state.allChats, ...results],
            output: [...this.state.output, ...results],
            isFetching: false
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
            (item.otherUser.name.toLowerCase().startsWith(phase) || item.otherUser.username.toLowerCase().startsWith(phase))
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
        SearchOnChatListAPI(searchKey, this.ShowSearchedResult.bind(this, searchKey))
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

    ReloadChats = ()=>{
        let chatHistory = GetChatHistory()
        if(chatHistory){
            this.setState({
                allChats: chatHistory,
                output: chatHistory,
            })
        }

    }
    
    render(){
        return(
            <div onScroll={this.handleScroll}>
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
                    {this.state.output.sort(SortByUpdatedTimeDESC).map(ele =>{
                        let chatEle = ele.chats[ele.chats.length -1]
                        let created_at = ele.last_updated
                        let altText = ""
                        
                        if (!chatEle || chatEle.length< 1){
                            altText = <span className="suggested-text">Send hi, start a conversation</span>
                        }
                        else if(chatEle.user===this.state.currUser){
                            altText = <span className="sent-text"><FaShare className="self-sent"/> {chatEle.text}</span>
                        }
                        else{
                            altText = <span className="sent-text">{chatEle.text}</span>
                        }

                        let is_seen = ele.seen_by.includes(this.state.currUser)

                        return(
                            <div className={is_seen?"discover-list":"discover-list unread-msg"} key={"chat"+ele.otherUser.id} onClick={this.updateChatboxState.bind(this, ele.otherUser)}>
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

            </div>
        )
    }

}

export default RecentFriends
