import React, { Component } from 'react';
import { FiBell } from "react-icons/fi";
// import {FaBell} from "react-icons/fa";
import '../assets/css/navbar.css';


export class NotificationButton extends Component{
    state={
        unreadMsgs: false
    }
    render(){
        return(
            <React.Fragment>
                {this.state.unreadMsgs?
                <FiBell className="nav-icon unread-msgs"/>
                :
                <FiBell className="nav-icon"/>
                }
                
            </React.Fragment>
        )
    }
}
export default NotificationButton;