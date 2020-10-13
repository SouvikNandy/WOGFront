import React, { Component } from 'react';
import { TagUser } from './TagUser';
import { SideBarHead } from "../SideBar";
// Images for shot
import w1 from "../../assets/images/wedding1.jpg";
import { UserRecentFriends } from '../../utility/userData';
import OwlLoader from '../OwlLoader';

export class FriendList extends Component {
    state = {
        allFriends: null,
        output: [],
        tagged_users: []
    }

    componentDidMount(){
        UserRecentFriends(this.updateStateOnAPIcall);
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            allFriends: data,
            tagged_users: this.props.currentTags,
            output: data.filter(item=> !this.props.currentTagIDs.includes(item.id) ).slice(0,15)
        })
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

    render() {
        if(!this.state.allFriends) return(<React.Fragment><OwlLoader /></React.Fragment>)
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
