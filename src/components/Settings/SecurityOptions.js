import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {RiArrowDropDownLine} from 'react-icons/ri';
import {FaMapMarkerAlt} from 'react-icons/fa';
import {AiOutlineEyeInvisible, AiOutlineEye} from 'react-icons/ai';
import {createFloatingNotification} from '../FloatingNotifications';
import {msToDateTime} from '../../utility/Utility'

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
export default {ChangePassword, LoginActivity}