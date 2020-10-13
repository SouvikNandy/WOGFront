import React, { Component } from 'react';
import { TagUser } from './TagUser';
import { SideBarHead } from "../SideBar";
import { UserRecentFriends } from '../../utility/userData';
import OwlLoader from '../OwlLoader';
import { SearchOnFriendsAPI } from '../../utility/ApiSet';

export class FriendList extends Component {
    state = {
        allFriends: null,
        totalFriendsCount: 0,
        output: [],
        // tagged_users: [],
        lastSearched: null,
        lastSearchedCount: 0,
    }
    
    componentDidMount(){
        UserRecentFriends(this.updateStateOnAPIcall);
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            allFriends: data.results.map(ele => {
                if(this.props.currentTagIDs.includes(ele.id)){
                    ele.is_mentioned = true
                }
                return ele
            }
                
            ),
            totalFriendsCount: data.totalFriends,
            // tagged_users: this.props.currentTags,
            output: data.results.filter(ele=> !this.props.currentTagIDs.includes(ele.id))
        })
    }

    findFriends = (value) =>{
        let phase = value.toLowerCase();
        if(!phase){
            // show last filtered results
            this.setState({
                output: this.state.allFriends.filter(item=> !item.is_mentioned)
            })
            return true
        }

        let matchedRecords = this.state.allFriends.filter(item => 
            !this.props.currentTags.includes(item.id) && (item.name.toLowerCase().startsWith(phase) || item.username.toLowerCase().startsWith(phase)) && !item.is_mentioned
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
        console.log("prevUsernames", prevUsernames)
        console.log("received", data.results)
        let dataset = data.results.filter(ele=> !prevUsernames.includes(ele.username))
        console.log("filtered dataset", dataset)
        this.setState({
            allFriends: [...this.state.allFriends, ...dataset],
            output: data.results,
            lastSearched: searchKey,
            lastSearchedCount: data.count
        })
    }

    onAddMember = (idx) =>{
        // remove from output and allFriends
        // call to parent method to add to tagged user
        let record = this.state.output.filter(ele => ele.id===idx)[0];
        // call to add record in tagList
        this.props.tagMembers(record);


        this.setState({
            allFriends : this.state.allFriends.map(ele => {
                if(ele.id===idx){
                    ele.is_mentioned = true
                }
                return ele
            }),
            output: [...this.state.output.filter(ele=> ele.id!==idx)],
            // tagged_users: [...this.state.tagged_users, record]
        });
        
    }
    onRemoveMember = (idx) =>{
        let record = this.state.allFriends.filter(ele => ele.id===idx)[0];
        record.is_mentioned = false
        this.setState({
            // tagged_users: this.state.tagged_users.filter(ele => ele.id!==idx),
            allFriends : this.state.allFriends.map(ele => {
                if(ele.id===idx){
                    ele.is_mentioned = false
                }
                return ele
            }),
            output: [...this.state.output, record],
        })
        this.props.onRemoveMember(idx, true);
        
    }

    render() {
        if(!this.state.allFriends) return(<React.Fragment><OwlLoader /></React.Fragment>)
        let tagged_users = this.state.allFriends.filter(ele=> ele.is_mentioned && ele.is_mentioned===true)
        return (
            <React.Fragment>
                <SideBarHead 
                displaySideView={this.props.displaySideView} 
                searchPlaceHolder={this.props.searchPlaceHolder}
                searchOnChange={this.findFriends}
                focusSearchBar={true}
                />
                {tagged_users.map(item =>(
                    <TagUser key={item.id} data={item} onRemoveMember={this.onRemoveMember}/>
                ))}
                {this.state.output.map(item =>(
                    <TagUser key={item.id} data={item} onAddMember={this.onAddMember}/>
                ))}
            </React.Fragment>
        )
    }
}

export default FriendList
