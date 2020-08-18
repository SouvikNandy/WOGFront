import React, { Component } from 'react';
import { FiBell } from "react-icons/fi";
// import {FaBell} from "react-icons/fa";
import '../assets/css/navbar.css';
import {Redirect } from 'react-router-dom';


export class NotificationButton extends Component{
    state={
        unreadMsgs: true,
        redirectNow: false
    }

    componentDidMount(){
        if(this.props.pthName==="user-notifications"){
            this.setState({unreadMsgs: false})
        }
    }

    markAsRead =() =>{
        this.setState({unreadMsgs: false, redirectNow: true})
    }
    render(){
        if (this.state.redirectNow){
            return <Redirect to={`/user-notifications/${this.props.username}`} />
        }
        return(
            <React.Fragment>
                {this.state.unreadMsgs?
                <div className="unread-msgs" onClick={this.markAsRead}>
                    <div className="unread-icon"></div>
                    <FiBell className="nav-icon"/>
                </div>
                
                :
                <FiBell className="nav-icon"/>
                }
                
            </React.Fragment>
        )
    }
}
export default NotificationButton;