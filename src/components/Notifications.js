import React, { Component } from 'react';
import {NewsFeedUserMenu, NewsFeedSuggestions} from '../pages/NewsFeeds';
import '../assets/css/newsfeeds.css';
import '../assets/css/notifications.css';
import { Link } from "react-router-dom";
import {AiFillCloseCircle} from "react-icons/ai";

import w1 from "../assets/images/wedding1.jpg";

export class Notifications extends Component {
    render() {
        return (
            <div className="nf-container">
                <NewsFeedUserMenu />
                
                <div className="nf-feeds">
                    <NotificationPalette />
                </div>
                <NewsFeedSuggestions />
                
            </div>
        )
    }
}

export class NotificationPalette extends Component{
    state ={
        notification: [
            {
            user: {id:1, name: "John Doe", username: "johndoe", profile_pic: w1},
            body: {"id": 1, body: "commneted on your portfolio"}
            },
            {
            user: {id:1, name: "John Doe", username: "johndoe", profile_pic: w1},
            body: {"id": 2, body: "tagged you in a shot"}
            },
        ]
        
    }

    removeNotification = (idx) =>{
        this.setState ({ 
            notification: this.state.notification.filter(ele=> ele.body.id !== idx)
        })

    }
    render(){
        let notificationList = []
        this.state.notification.map(ele =>{
            notificationList.push(
                <NotificationCube key={ele.body.id} user={ele.user} body={ele.body} removeNotification={this.removeNotification.bind(this, ele.body.id)}/>
            )
            return ele
        })
        return(
            <React.Fragment>
                {notificationList}
            </React.Fragment>
        )
    }
}

export function NotificationCube(props){
    let user = props.user;
    let body = props.body
    return(
        <div className="noti-cube">
            <Link key={user.id} to={{pathname: `/profile/${user.username}`}}><img className="link tag-img" src={user.profile_pic} alt="" /></Link>
            <div className="noti-content">
                <Link className="link m-display-name" to={{pathname: `/profile/${user.username}`}}>
                    {user.name}
                </Link>
                <span className="noti-body">{body.body}</span>

            </div>
            <div className="noti-options">
                <AiFillCloseCircle className="close-btn" onClick={props.removeNotification} />  
            </div>
            
                
        </div>
    )
}

export default Notifications


