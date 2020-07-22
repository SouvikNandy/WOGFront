import React, { Component } from 'react';
import {UserNavBar} from "../components/Navbar";
import NewsFeeds from './NewsFeeds';
import Profile from './Profile'
import Notifications from '../components/Notifications'

export class UserLoggedInView extends Component {
    state = {
        selectedContent: null
    }

    componentDidMount(){
        this.setState({
            selectedContent: <NewsFeeds />
        })
    }
    showContent =(key) =>{
        console.log("selected key", key);
        switch (key){
            case "feeds":
                this.setState({selectedContent: <NewsFeeds />})
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
                <UserNavBar showContent={this.showContent}/>
                {this.state.selectedContent}
            </React.Fragment>
        )
    }
}

export default UserLoggedInView
