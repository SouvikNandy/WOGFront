import React from 'react';
import '../assets/css/settings.css';
import '../assets/css/logOutModal.css';
import {LogOutUser} from '../utility/Utility'

export default function LogOutPromptModal(props) {
    const callLogOut = () =>{
        LogOutUser()
        window.location.reload();
    }
    return (
        <div className="log-out-prompt">
            <div className="lg-overlay"></div>
            <div className="user-input-popup-container">
                <div className="user-input-popup">
                    <span>Are you sure to Log out ?</span>
                    <div className="pop-up-action">
                        <span className="pop-up-option-opt" onClick={callLogOut}>Yes</span>
                        <span className="pop-up-option-opt" onClick={props.prvBtnClick}>No</span>
                    </div>
                </div>

            </div>
            
        </div>
    )
}


