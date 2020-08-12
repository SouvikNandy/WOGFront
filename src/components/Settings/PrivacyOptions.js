import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {RiArrowDropDownLine} from 'react-icons/ri';
import TagUser from '../Profile/TagUser';
import w1 from '../../assets/images/wedding_1.jpg'

// PRIVACY MENU OPTIONS

// INTERACTIONS

// Comments
export class Comments extends Component{
    state={
        allowComments: [
            {id: 1, option: "Everyone", selected: true},
            {id: 2, option: "Followers & Following", selected: false},
            {id: 3, option: "People You Follow", selected: false},
            {id: 4, option: "Your Followers", selected: false},
        ],
        allowCommentsDropdown: false,
    }

    showAllowCommentsDropDown = () =>{
        this.setState({allowCommentsDropdown : !this.state.allowCommentsDropdown})
    }

    selectfromAllowComments = (idx) => {
        this.setState({
            allowComments : this.state.allowComments.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }

    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Comments"} altBackBtn={true}
            />
                <div className="set-menu select-options" onClick={this.showAllowCommentsDropDown}>
                        <span>Allow Comments From</span>
                        <div className="prev-selected">
                            <span className="selected-text">{this.state.allowComments.filter(ele => ele.selected=== true)[0].option}</span>
                            <RiArrowDropDownLine  className="ico" />
                        </div>
                        {this.state.allowCommentsDropdown?
                            <div className="opt-dropdown">
                                {this.state.allowComments.map(ele => {
                                    return(
                                        <div className="opt-menu" key={ele.id} onClick={this.selectfromAllowComments.bind(this, ele.id)}>
                                            {ele.option}
                                        </div>

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


// Tags 
export class Tags extends Component{
    state ={
        allowTags: [
            {id: 1, option: "No One", selected: false},
            {id: 2, option: "Followers & Following", selected: true},
            
        ],
        allowTagsDropdown: false,
        approveManually : [
            {id: 1, option: "Enable", selected: false},
            {id: 2, option: "Disable", selected: true},
        ],
        approveManuallyDropdown: false,


    }

    showDropDown = (key) =>{
        if (key === "allowTagsDropdown"){
            this.setState({allowTagsDropdown : !this.state.allowTagsDropdown})
        }
        else if (key === "approveManuallyDropdown"){
            this.setState({approveManuallyDropdown : !this.state.approveManuallyDropdown})
        }
        
    }

    selectfromAllowTags = (idx) => {
        this.setState({
            allowTags : this.state.allowTags.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }

    switchManualApprove = (idx) => {
        this.setState({
            approveManually : this.state.approveManually.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Tags"} altBackBtn={true} />

                <div className="set-menu select-options" onClick={this.showDropDown.bind(this, 'allowTagsDropdown')}>
                    <span>Allow Tags From</span>
                    <div className="prev-selected">
                        <span className="selected-text">{this.state.allowTags.filter(ele => ele.selected=== true)[0].option}</span>
                        <RiArrowDropDownLine  className="ico" />
                    </div>
                    {this.state.allowTagsDropdown?
                        <div className="opt-dropdown">
                            {this.state.allowTags.map(ele => {
                                return(
                                    <div className="opt-menu" key={ele.id} onClick={this.selectfromAllowTags.bind(this, ele.id)}>
                                        {ele.option}
                                    </div>
                                )
                            })}
                        </div>
                        : 
                        ""
                    }
                </div>
                <div className="set-menu select-options" onClick={this.showDropDown.bind(this, 'approveManuallyDropdown')}>
                        <span>Approve Tags manually</span>
                        <div className="prev-selected">
                            <span className="selected-text">{this.state.approveManually.filter(ele => ele.selected=== true)[0].option}</span>
                            <RiArrowDropDownLine  className="ico" />
                        </div>
                        {this.state.approveManuallyDropdown?
                            <div className="opt-dropdown">
                                {this.state.approveManually.map(ele => {
                                    return(
                                        <div className="opt-menu" key={ele.id} onClick={this.switchManualApprove.bind(this, ele.id)}>
                                            {ele.option}
                                        </div>

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

// Mentions
export class Mentions extends Component{
    state = {
        mentionOpt : [
            {id: 1, option: "No One", selected: false},
            {id: 2, option: "Followers & Following", selected: true},
        ],
        openDropdown: false
    }
    showDropDown = () =>{
        this.setState({openDropdown : !this.state.openDropdown})
    }

    selectoption = (idx) => {
        this.setState({
            mentionOpt : this.state.mentionOpt.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Mentions"} altBackBtn={true} />

                <div className="set-menu select-options" onClick={this.showDropDown}>
                    <span>Allow Mentions From</span>
                    <div className="prev-selected">
                        <span className="selected-text">{this.state.mentionOpt.filter(ele => ele.selected=== true)[0].option}</span>
                        <RiArrowDropDownLine  className="ico" />
                    </div>
                    {this.state.openDropdown?
                        <div className="opt-dropdown">
                            {this.state.mentionOpt.map(ele => {
                                return(
                                    <div className="opt-menu" key={ele.id} onClick={this.selectoption.bind(this, ele.id)}>
                                        {ele.option}
                                    </div>
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



// CONNECTIONS
// AccountPrivacy
export class AccountPrivacy extends Component{
    state = {
        options : [
            {id: 1, option: "Enable", selected: false},
            {id: 2, option: "Disable", selected: true},
        ],
        openDropdown: false
    }
    showDropDown = () =>{
        this.setState({openDropdown : !this.state.openDropdown})
    }

    selectoption = (idx) => {
        this.setState({
            options : this.state.options.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Account Privacy"} altBackBtn={true} />

                <div className="set-menu select-options" onClick={this.showDropDown}>
                    <span>Private Account</span>
                    <div className="prev-selected">
                        <span className="selected-text">{this.state.options.filter(ele => ele.selected=== true)[0].option}</span>
                        <RiArrowDropDownLine  className="ico" />
                    </div>
                    {this.state.openDropdown?
                        <div className="opt-dropdown">
                            {this.state.options.map(ele => {
                                return(
                                    <div className="opt-menu" key={ele.id} onClick={this.selectoption.bind(this, ele.id)}>
                                        {ele.option}
                                    </div>
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

// Blocked Accounts
export class BlockedAccounts extends Component{
    state ={
        blockedUsers:[
            {id:1, name: "John Doe", username: "Johndoe", designation: "photographer", profile_pic: w1},
            {id:2, name: "Jane Doe", username: "Johndoe", designation: "makeup artist", profile_pic: w1}
        ]
    }

    unBolockRequest = (idx) =>{
        // unblock user if blocked
        this.setState({
            blockedUsers : this.state.blockedUsers.filter(ele=> ele.id!==idx)
        })
    }

    render(){
        let userList = []
        this.state.blockedUsers.map( item =>{
            userList.push(<TagUser key={item.id} data={item} allowUnblock={this.unBolockRequest}/>)
            return item
                
        })
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Blocked Accounts"} altBackBtn={true} />
                {userList}
            </React.Fragment>
        )
    }
}


// Close Friends
export class CloseFriends extends Component{
    state ={
        closeFriends:[
            {id:1, name: "John Doe", username: "Johndoe", designation: "photographer", profile_pic: w1},
            {id:2, name: "Jane Doe", username: "Johndoe", designation: "makeup artist", profile_pic: w1}
        ]
    }

    removeUser = (idx) =>{
        // unblock user if blocked
        this.setState({
            closeFriends : this.state.closeFriends.filter(ele=> ele.id!==idx)
        })
    }

    render(){
        let userList = []
        this.state.closeFriends.map( item =>{
            userList.push(<TagUser key={item.id} data={item} onRemoveMember={this.removeUser}/>)
            return item
                
        })
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Close Friends"} altBackBtn={true} />
                {userList}
            </React.Fragment>
        )
    }
}
export default {Comments, Tags, Mentions, AccountPrivacy, BlockedAccounts, CloseFriends}