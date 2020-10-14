import React, { Component } from 'react';
import { UserRecentFriends } from '../../utility/userData';
import OwlLoader from '../OwlLoader';
import { SearchOnFriendsAPI } from '../../utility/ApiSet';
import { UserFlat } from './UserView';
import SearchBar from '../Search/SearchBar';
import '../../assets/css/discoverPeople.css';
import { FiSearch } from 'react-icons/fi';
import Chatbox, { OpenChatRecord } from '../ChatModule/Chatbox';

export class RecentFriends extends Component {
    state = {
        allFriends: null,
        totalFriendsCount: 0,
        output: [],
        lastSearched: null,
        lastSearchedCount: 0,
        showChatBox: false,
        chatBoxUser: null,
        openChats: []
    }
    
    componentDidMount(){
        UserRecentFriends(this.updateStateOnAPIcall);
    }

    moveToOpenChats = (ele) => this.setState({openChats: [ele, ...this.state.openChats], showChatBox:false, chatBoxUser: null})
        
    removeFromOpenChat = (ele) => this.setState({openChats: this.state.openChats.filter(item=> item.username!== ele.username)})
    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            allFriends: data.results,
            totalFriendsCount: data.totalFriends,
            output: data.results
        })
    }

    updateChatboxState = (chatUser=null) =>{
        let showChatBox = !this.state.showChatBox;
        let openChats = this.state.openChats
        if(showChatBox){
            openChats = this.state.openChats.filter(ele => ele.username!==chatUser.username)
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

export default RecentFriends
