import React, { Component } from 'react';
import { TagUser } from './TagUser';
import { SideBarHead } from "./SideBar";
// Images for shot
import w1 from "../assets/images/wedding1.jpg";

export class FriendList extends Component {
    state = {
        allFriends:[
            {"id": 1, "name":"John Doe", "username": "johndoe", "profile_pic": w1, "designation": "photographer"},
            {"id": 2, "name":"James Jr.", "username": "jamesjr", "profile_pic": w1, "designation": "photographer"},
            {"id": 3, "name":"Mike Hussy", "username": "mikehussy", "profile_pic": w1, "designation": "photographer"},
            {"id": 4, "name":"Jane Doe", "username": "janedoe", "profile_pic": w1, "designation": "photographer"},
            {"id": 5, "name":"Peter Parker", "username": "peterparker", "profile_pic": w1, "designation": "photographer"},
            {"id": 6, "name":"mery Jane", "username": "meryjane", "profile_pic": w1, "designation": "photographer"},
            {"id": 7, "name":"harry Potter", "username": "harrypotter", "profile_pic": w1, "designation": "photographer"},
            {"id": 8, "name":"Albus Dumbledore", "username": "albusdumbledore", "profile_pic": w1, "designation": "photographer"},
            {"id": 9, "name":"Prof. Snape", "username": "snapehere", "profile_pic": w1, "designation": "photographer"},
            {"id": 10, "name":"Eve Mendis", "username": "evemendis", "profile_pic": w1, "designation": "photographer"}

        ],
        output: [],
        tagged_users: []
    }

    findFriends = (value) =>{
        console.log("received phase", value)
        let phase = value.toLowerCase();
        if(!phase){
            // show last filtered results
            return true
        }
        
        let matchedRecords = this.state.allFriends.filter(item => !this.props.currentTags.includes(item.id) && (item.name.toLowerCase().startsWith(phase) || item.username.toLowerCase().startsWith(phase)));
        this.setState({
            output: [...matchedRecords]
        })
    }

    onAddMember = (idx) =>{
        // remove from output and allFriends
        // call to parent method to add to tagged user
        let record = this.state.output.filter(ele => ele.id===idx)[0];
        // call to add record in tagList
        this.props.tagMembers(record);

        this.setState({
            allFriends : [...this.state.allFriends.filter(ele => ele.id!==idx)],
            output: [...this.state.output.filter(ele=> ele.id!==idx)],
            tagged_users: [...this.state.tagged_users, record]
        });
        
    }
    onRemoveMember = (idx) =>{
        let record = this.state.tagged_users.filter(ele => ele.id===idx)[0];
        this.setState({
            tagged_users: this.state.tagged_users.filter(ele => ele.id!==idx),
            allFriends : [...this.state.allFriends, record],
            output: [...this.state.output, record],
        })
        this.props.onRemoveMember(idx, true);
        
    }

    componentDidMount(){
        this.setState({
            tagged_users: this.props.currentTags,
            output: this.state.allFriends.filter(item=> !this.props.currentTagIDs.includes(item.id) ).slice(0,15)
        })
    }


    render() {
        return (
            <React.Fragment>
                <SideBarHead 
                displaySideView={this.props.displaySideView} 
                searchPlaceHolder={this.props.searchPlaceHolder}
                searchOnChange={this.findFriends}
                focusSearchBar={true}
                />
                {this.state.tagged_users.map(item =>(
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
