import React, { Component } from 'react';
import '../assets/css/settings.css';
import '../assets/css/logOutModal.css';
import {LogOutUser} from '../utility/Utility'
import { Redirect } from 'react-router-dom';
import { GoBack } from './GoBack';


export default class LogOutPromptModal extends Component {
    state ={isLoggedOut: false}

    callLogOut = () =>{
        LogOutUser()
        this.setState({isLoggedOut:true})
    }
    render(){
        if(this.state.isLoggedOut){
            return(<Redirect to={{ pathname: "/signin/" }} />)
        }
        return (
            <div className="log-out-prompt">
                <div className="user-input-popup-container">
                    <div className="user-input-popup">
                        <span>Are you sure to Log out ?</span>
                        <div className="pop-up-action">
                            <span className="pop-up-option-opt" onClick={this.callLogOut}>Yes</span>
                            <span className="pop-up-option-opt"><GoBack showIcon={false} btnText={"No"} {...this.props} /></span>
                        </div>
                    </div>
    
                </div>
                
            </div>
        )

    }
    
}


