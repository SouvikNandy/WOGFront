import React, { Component } from 'react';
import {UserNavBar} from "../components/Navbar";
import NewsFeeds from './NewsFeeds';
import Profile from './Profile'
import Notifications from '../components/Notifications'

export class UserLoggedInView extends Component {
    state = {
        selectedContent: null,
        selectedUserNav: null
    }

    componentDidMount(){
        this.setState({
            selectedContent: <NewsFeeds showuserSaved={this.showuserSaved}/>
        })
    }

    showuserSaved = () =>{
        this.setState({
            selectedUserNav: "profile",
            selectedContent: <Profile  showNav={false} activeMenu={"Saved"}/>
        })
    }

    showContent =(key) =>{
        console.log("selected key", key);
        switch (key){
            case "feeds":
                this.setState({selectedContent: <NewsFeeds showuserSaved={this.showuserSaved}/>})
                return
            case "notification":
                    this.setState({selectedContent: <Notifications />})
                    return
            case "profile":
                this.setState({selectedContent: <Profile  showNav={false}/>})
                return
            default:
                this.setState({selectedContent: ""})
                return
        }
    }
    render() {
        return (
            <React.Fragment>
                <UserNavBar showContent={this.showContent} activeUserNav={this.state.selectedUserNav}/>
                {this.state.selectedContent}
            </React.Fragment>
        )
    }
}

export default UserLoggedInView
