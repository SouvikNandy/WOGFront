import React, { Component } from 'react';
import {NewsFeedUserMenu, NewsFeedSuggestions} from './NewsFeeds';
import '../assets/css/newsfeeds.css';
import '../assets/css/notifications.css';
import { Link } from "react-router-dom";
import {BsThreeDotsVertical} from "react-icons/bs";
import {FiBellOff} from 'react-icons/fi';
import {AiFillCloseCircle} from 'react-icons/ai'
import {UserNavBar} from "../components/Navbar/Navbar";
import getUserData from '../utility/userData';


import w1 from "../assets/images/wedding1.jpg";


export class Notifications extends Component {
    render() {
        let userData = getUserData();
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"notification"} username={userData.username} pthName={"user-notifications"} />
                <div className="nf-container">
                    <NewsFeedUserMenu {...this.props} userData={userData}/>
                    
                    <div className="nf-feeds">
                        <NotificationPalette />
                    </div>
                    <NewsFeedSuggestions />
                
                </div>
                
            </React.Fragment>
            
        )
    }
}

export class NotificationPalette extends Component{
    state ={
        notification: [
            {
            user: {id:1, name: "John Doe", username: "johndoe", profile_pic: w1},
            body: {"id": 1, body: "commneted on your portfolio", is_read: false}
            },
            {
            user: {id:1, name: "John Doe", username: "johndoe", profile_pic: w1},
            body: {"id": 2, body: "tagged you in a shot", is_read: true}
            },
        ]
        
    }

    markAsRead = (idx) =>{
        this.setState({
            notification: this.state.notification.map(ele=>{
                if(ele.body.id === idx){
                    ele.is_read = true;
                }
                return ele
            })
        })
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
                <NotificationCube key={ele.body.id} user={ele.user} body={ele.body}
                markAsRead={this.markAsRead.bind(this, ele.body.id)}
                removeNotification={this.removeNotification.bind(this, ele.body.id)}/>
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

export class NotificationCube extends Component{
    state = {
        showMenu: false,
    }

    showOptions = () =>{
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    render(){
        let user = this.props.user;
        let body = this.props.body
        return(
            <React.Fragment>
                <div className={body.is_read? "noti-cube" : "noti-cube unread-content"}>
                    <Link key={user.id} to={{pathname: `/profile/${user.username}`}}><img className="link tag-img" src={user.profile_pic} alt="" /></Link>
                    <div className="noti-content" onClick={this.props.markAsRead}>
                        <Link className="link m-display-name" to={{pathname: `/profile/${user.username}`}}>
                            {user.name}
                        </Link>
                        <span className="noti-body">{body.body}</span>

                    </div>
                    <div className="noti-options">
                        <BsThreeDotsVertical className="close-btn" onClick={this.showOptions}/> 
                        
                    </div>
                        
                </div>
                {this.state.showMenu?
                    <div className="selection-overlay">
                        <div className="selection-option">
                            <div className="s-noti"><FiBellOff className="close-btn" /><span>Turn Off further notifications</span></div>
                            <div className="s-noti" onClick={this.props.removeNotification}>
                                <AiFillCloseCircle className="close-btn" />
                                <span>Remove notification</span>
                            </div>
                        </div>
                        <div className="escape-overlay" onClick={this.showOptions}></div>
                        
                    </div>
                :
                ""
                }
            
            </React.Fragment>
        )
}

    }
    

export default Notifications


