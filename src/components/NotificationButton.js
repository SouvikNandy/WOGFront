import React, { Component } from 'react';
import { FiBell } from "react-icons/fi";
import '../assets/css/navbar.css';
import {Redirect } from 'react-router-dom';
import { getNotificationHandler } from '../utility/userData';

export class NotificationButton extends Component{
    state={
        unreadMsg: false,
        redirectNow: false,
        notificationHandler : getNotificationHandler()
    }

    componentDidMount(){
        // set initial state
        if(this.props.pthName==="user-notifications"){
            this.setState({unreadMsg: false})
        }
        else{
            this.setState({unreadMsg: this.state.notificationHandler.isUnreadExists()})
            
        }
        console.log("notificationHandler from NotificationButton", this.state.notificationHandler)
        // update on new notification
        this.state.notificationHandler.registerCallbackList(this.onNewNotification)
    }

    componentWillUnmount(){
        this.state.notificationHandler.deregisterCallback()
    }

    onNewNotification = (data) =>{
        if(data && data.key==="NOTIFICATION"){
            this.setState({unreadMsg: true})
        }

    }

    readNotifications =() =>{
        this.setState({unreadMsg: false, redirectNow: true})
    }
    render(){
        if (this.state.redirectNow){
            return <Redirect to={`/user-notifications/${this.props.username}`} />
        }
        return(
            <React.Fragment>
                {this.props.pthName!=="user-notifications"?
                    <div className="unread-msgs" onClick={this.readNotifications}>
                        {this.state.unreadMsg? 
                        <div className="unread-icon"></div>
                        :
                        ""
                        }
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