import React, { Component } from 'react';
import {NewsFeedUserMenu, NewsFeedSuggestions} from './NewsFeeds';
import '../assets/css/newsfeeds.css';
import '../assets/css/notifications.css';
import { Link } from "react-router-dom";
import {BsThreeDotsVertical} from "react-icons/bs";
import {FiBellOff} from 'react-icons/fi';
import {AiFillCloseCircle} from 'react-icons/ai'
import {UserNavBar} from "../components/Navbar/Navbar";
import getUserData, { getNotificationHandler, setNotificationHandler } from '../utility/userData';

import { FetchNotifications } from '../utility/ApiSet';
import Paginator from '../utility/Paginator';
import OwlLoader from '../components/OwlLoader';
import { FaUserCircle } from 'react-icons/fa';
import NoContent from '../components/NoContent';
import { timeDifference } from '../utility/Utility';


export class Notifications extends Component {
    render() {
        let userData = getUserData();
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"notification"} username={userData.username} pthName={"user-notifications"} />
                <div className="nf-container">
                    <NewsFeedUserMenu {...this.props} userData={userData}/>
                    
                    <div className="nf-feeds">
                        <NotificationPalette curLocation={this.props.location}/>
                    </div>
                    <NewsFeedSuggestions />
                
                </div>
                
            </React.Fragment>
            
        )
    }
}

export class NotificationPalette extends Component{
    state ={
        notification: null,
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
        notificationHandler : getNotificationHandler()
    }
    componentDidMount(){
        FetchNotifications(this.updateStateOnAPIcall)
        let eventListnerRef = this.handleScroll.bind(this);
        this.setState({eventListnerRef: eventListnerRef})
        window.addEventListener('scroll', eventListnerRef);

        if (!this.state.notificationHandler) {
            this.setState({notificationHandler: setNotificationHandler()})
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        // get unseen notification and mark them as seen
        let unseenNid = this.state.notification.filter(ele => ele.is_seen === false).map(ele =>{return ele.id})
        this.state.notificationHandler.markAsSeen(unseenNid)
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            notification: data.results,
            paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        })
        
        
    }
    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            notification:[...this.state.notification, ...results],
            isFetching: false
        })
    }

    markAsRead = (idx) =>{
        // mark as read
        console.log("mark as read called with id", idx)
        
        this.setState({
            notification: this.state.notification.map(ele=>{
                if(ele.id === idx && !ele.is_read){
                    ele.is_read = true;
                    this.state.notificationHandler.markAsRead(idx);
                }
                return ele
            })
        })
    }
    

    removeNotification = (idx) =>{
        this.setState ({ 
            notification: this.state.notification.filter(ele=> ele.id !== idx)
        })

    }
    render(){
        if(!this.state.notification) return(<React.Fragment><OwlLoader /></React.Fragment>)
        let notificationList = []
        this.state.notification.map(ele =>{
            notificationList.push(
                <NotificationCube key={ele.id} data={ele}
                markAsRead={this.markAsRead.bind(this, ele.id)}
                removeNotification={this.removeNotification.bind(this, ele.id)}
                curLocation={this.props.curLocation}
                />
            )
            return ele
        })
        return(
            <React.Fragment>
                {notificationList.length > 0?
                    notificationList
                    :
                    <div className="empty-notifications"><NoContent message="No notifications yet"/></div>
                }
                {/* {notificationList} */}
            </React.Fragment>
        )
    }
}


const constructText = (userList, text, _type, redirection_context) =>{

    if (_type === "FOLLOW"){
        return(
            <div className="n-user-text">
                <span className="m-display-name">{redirection_context["username"]}</span> <span>{text}</span>
            </div>
        )
    }

    if (userList.length === 0) return '';
    else if (userList.length === 1){
        return(
            <div className="n-user-text">
                <span className="m-display-name">{userList[0]}</span> <span>{text}</span>
            </div>
            
        )
    }
    else if (userList.length === 2){
        return(
            <div className="n-user-text">
                <span className="m-display-name">{userList[0]}</span> and <span className="m-display-name">{userList[1]}</span> <span>{text}</span>
            </div>
            
        )
    }
    else if(userList.length > 2){
        return(
            <div className="n-user-text">
                <span className="m-display-name">{userList[0]}</span>,<span className="m-display-name">{userList[1]}</span> <span>and {userList.length-2} others</span> <span>{text}</span>
            </div>
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
        let user = this.props.data.user;
        let body = this.props.data;
        let redirectionLink = '';
        let redirectionState = {};
        let redirection_context = body.redirection_context
        if (['POST', 'COMMENT', 'REPLY'].includes(body.type)){
            redirectionLink = '/shot-view/'+redirection_context.post_user+'-'+redirection_context.post+'-'+redirection_context.shot;
            redirectionState = { modal: true, currLocation: this.props.curLocation };
        }
        else if(body.type === "FOLLOW"){
            redirectionLink ='/profile/'+redirection_context.username;
        }
        return(
            <React.Fragment>
                <div className={body.is_read? "noti-cube" : "noti-cube unread-content"} >
                    {user.profile_pic?
                    <img className="tag-img" src={user.profile_pic} alt="" />
                    :
                    <FaUserCircle className="tag-img"/>
                    }
                    
                    <Link className="link noti-content" onClick={()=> {
                    this.props.markAsRead()
                    }}
                    key={this.props.data.id}
                    to={{
                        pathname: redirectionLink,
                        state: redirectionState
                    }}>
                        <span className="noti-body">{constructText(body.user_list, body.text, body.type, body.redirection_context)}</span>
                        <span className="noti-time">{timeDifference(body.updated_at)}</span>
                    </Link>
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


