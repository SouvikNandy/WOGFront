import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {FaMapMarkerAlt} from 'react-icons/fa';
import {AiOutlineEyeInvisible, AiOutlineEye} from 'react-icons/ai';
import {createFloatingNotification} from '../FloatingNotifications';
import {msToDateTime} from '../../utility/Utility';
import EditProfile from '../Profile/EditProfile';
import {RecentSearchPalette} from '../Search/SearchHead'

import w1 from '../../assets/images/wedding1.jpg';
import pl2 from '../../assets/images/people/2.jpg';
// SECURITY MENU OPTIONS

// CHANGE PASSWORD
export class ChangePassword extends Component{
    state ={
        oldPass: '',
        newPass: '',
        confirmPass: '',
        viewOldpass: false,
        viewNewPass: false,
        viewconfirmPass: false,
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    })

    showHidePass = (name) =>{
        this.setState({
            [name]: !this.state[name]
        })

    }

    validate = () =>{
        if(!this.state.oldPass || !this.state.newPass || !this.state.confirmPass){
            createFloatingNotification("error", "Inavlid Request!", "Please fill all 3 fields to continue");
            return false
        }
        else if (this.state.newPass !== this.state.confirmPass){
            createFloatingNotification("error", "Inavlid Request!", "Your new password and re-entered password didn't match");
            return false
        }
        
        return true
    }

    onSubmit = (e) =>{
        e.preventDefault();
        let is_validated = this.validate();
        if(is_validated){
            // axios call
            createFloatingNotification("success", "Password Changed!", "Your pasword has been updated.");
            document.getElementById("change-pass-form").reset();
            this.setState({
                oldPass: '',
                newPass: '',
                confirmPass: '',
                viewOldpass: false,
                viewNewPass: false,
                viewconfirmPass: false,

            })
        }
    }

    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Change Password"} altBackBtn={true} />
            
            <form className="change-pass-container" id="change-pass-form" onSubmit={this.onSubmit}>
                <label>Current Password</label>
                <div className="password-inp-field">
                    
                    {!this.state.viewOldpass?
                        <React.Fragment>
                            <input type="password" placeholder="Enter your current password" defaultValue={this.state.oldPass} 
                            name="oldPass" onChange={this.onChange}></input>
                            <AiOutlineEye className="show-hide-icon" onClick={this.showHidePass.bind(this, "viewOldpass") } />
                        </React.Fragment>
                        
                        : 
                        <React.Fragment>
                            <input type="text" placeholder="Enter your current password" defaultValue={this.state.oldPass} 
                            name="oldPass" onChange={this.onChange}></input>
                            <AiOutlineEyeInvisible className="show-hide-icon" onClick={this.showHidePass.bind(this, "viewOldpass") } />

                        </React.Fragment>
                    }
                </div>
                <label>New Password</label>
                <div className="password-inp-field">
                    
                    {!this.state.viewNewPass?
                        <React.Fragment>
                            <input type="password" placeholder="Enter your new password" defaultValue={this.state.newPass}
                            name="newPass" onChange={this.onChange}></input>
                            <AiOutlineEye className="show-hide-icon" onClick={this.showHidePass.bind(this, "viewNewPass")} />
                        </React.Fragment>
                        
                        : 
                        <React.Fragment>
                            <input type="text" placeholder="Enter your new password" defaultValue={this.state.newPass}
                            name="newPass" onChange={this.onChange}></input>
                            <AiOutlineEyeInvisible className="show-hide-icon" onClick={this.showHidePass.bind(this, "viewNewPass")} />
                        </React.Fragment>
                        
                    }
                </div>
                <label>Confirm New Password</label>
                <div className="password-inp-field">
                    
                    {!this.state.viewconfirmPass?
                        <React.Fragment>
                            <input type="password" placeholder="Re-Enter your new password" defaultValue={this.state.confirmPass} 
                            name="confirmPass" onChange={this.onChange}></input>
                            <AiOutlineEye className="show-hide-icon" onClick={this.showHidePass.bind(this, "viewconfirmPass")} />
                        </React.Fragment>
                        : 
                        <React.Fragment>
                           <input type="text" placeholder="Re-Enter your new password" defaultValue={this.state.confirmPass}
                            name="confirmPass" onChange={this.onChange}></input>
                            <AiOutlineEyeInvisible className="show-hide-icon" onClick={this.showHidePass.bind(this, "viewconfirmPass")} />
                        </React.Fragment>
                        
                    }
                </div>
                <div className="submit-div">
                    <button className="btn submit-btn">Submit</button>

                </div>
            </form>
            </React.Fragment>
        )
    }
}

export class LoginActivity extends Component{
    state={
        records : [
            {id: 1, location: "Kolkata, India", "created_at": 1589028744},
            {id: 2, location: "Howrah, India", "created_at": 1589028755}
        ]
    }

    render(){
        return(
            <React.Fragment>
                 <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Login Activity"} altBackBtn={true} />
                
                {this.state.records.map(ele =>{
                    return(
                        <div className="login-details-div">
                            <FaMapMarkerAlt className="ico" />
                            <div className="location-content">
                                <span className="loc">{ele.location}</span>
                                <span className="activity-time">{msToDateTime(ele.created_at)}</span>
                            </div>
                        </div>
                    )
                })}

            </React.Fragment>
        )
    }
}



export class AccountData extends Component{
    state ={
        userAbout:{
            // profile top
            "name": "Jane Doe",
            "username": "janedoe",
            "deisgnantion": "photographer",
            "email": "souvikpxnandy@gmail.com",
            "profile_pic": pl2,
            "cover_pic": w1,
            "isFollowing": false,

            // about
            "joined": "Feb 15, 2020",
            "bio": "A digital agency for the modern world. We challenge core assumptions, unpick legacy behaviors, and streamline complex processes. Contact us at info@bb.agency",
            "skills": ["photography", "dashboard", "development", "web design"],
            "hometown": "Kolkata, India",
            "currentcity": "Kolkata, India",
            "birthday": "1 January, 1990",
            // team
            "teams" : [w1, pl2, w1, pl2],

            // social handles
            social_handles : {
                "web": "www.abc.com",
                "facebook": "www.facebook.com/abc",
                "instagram": "www.instagram.com/abc",
                "youtube": "www.youtube.com/abc",
                "pinterest": null
            }
            
        }
    }
    render(){
        return(
            <React.Fragment>
                <EditProfile closeModal={this.props.prvBtnClick}/>
            </React.Fragment>
        )
    }
}

export function ConfirmationPopup(props){
    return(
        <div className="user-input-popup-container">
            <div className="user-input-popup">
                {props.confMessage?
                    <span>{props.confMessage}</span>
                    :
                    <span>Are you sure to coninue ?</span>
                }
                
                <div className="pop-up-action">
                    <span className="pop-up-option-opt" onClick={props.onContinue}>Yes</span>
                    <span className="pop-up-option-opt" onClick={props.prvBtnClick}>No</span>
                </div>
            </div>

        </div>
    )
}

export class SearchHistory extends Component{
    state={
        recentSearch : [
            {id:1,  phase: '#goodVibes', category: "hashtag"}, 
            {id:2,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:3,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:4,  "phase": '#goodVibes', "category": "hashtag"}, 
            {id:11,  phase: '#goodVibes', category: "hashtag"}, 
            {id:12,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:13,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:14,  "phase": '#goodVibes', "category": "hashtag"},

        ],
    }
    removeFromRecent = (idx) =>{
        if (idx === "all"){
            this.setState({
                recentSearch : []
            })
        }
        else{
            this.setState({
                recentSearch : this.state.recentSearch.filter(ele => ele.id !== idx)
            })

        }
        
    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Search History"} altBackBtn={true} />
                <RecentSearchPalette data={this.state.recentSearch} removeFromRecent={this.removeFromRecent} />
            </React.Fragment>
        )
    }
}
export default {ChangePassword, LoginActivity, AccountData, ConfirmationPopup, SearchHistory}