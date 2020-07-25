import React, { Component } from 'react';
import {UserNavBar} from "../components/Navbar";
import NewsFeeds from './NewsFeeds';
import Profile from './Profile'
import Notifications from '../components/Notifications'
import DiscoverPeople from '../components/DiscoverPeople';

export class UserLoggedInView extends Component {
    state = {
        selectedContent: null,
        showNav: true,
        selectedMenu: null
    }

    componentDidMount(){
        this.setState({
            selectedContent: <NewsFeeds showContent={this.showContent} />
        })
    }

    showContent =(key) =>{
        //console.log("selected key", key);
        switch (key){
            case "feeds":
                this.setState({
                    showNav: true,
                    selectedMenu: key,
                    selectedContent: <NewsFeeds showContent={this.showContent} />})
                return
            case "notification":
                this.setState({
                    showNav: true,
                    selectedMenu: key,
                    selectedContent: <Notifications showContent={this.showContent} />})
                return
            case "profile":
                this.setState({
                    showNav:true,
                    selectedMenu: key,
                    selectedContent: <Profile  showNav={false}/>})
                return
            case "profile-saved":
                this.setState({
                    showNav: false,
                    selectedContent:
                    <React.Fragment>
                        <UserNavBar showContent={this.showContent} selectedMenu={"profile"}/>
                        <Profile  showNav={false} activeMenu={"Saved"}/>
                    </React.Fragment> 
                    })
                return
            case "profile-reviews":                
                this.setState({
                    showNav: false,
                    selectedContent: 
                    <React.Fragment>
                        <UserNavBar showContent={this.showContent} selectedMenu={"profile"} />
                        <Profile  showNav={false} activeMenu={"Reviews"}/>
                    </React.Fragment>
                    })
                return
            case "discover-people":
                this.setState({
                    showNav: false,
                    selectedContent: 
                    <React.Fragment>
                        <UserNavBar showContent={this.showContent} selectedMenu={"unselected"}/>
                        <DiscoverPeople showContent={this.showContent}/> 
                    </React.Fragment>
                
            })
                return
            default:
                this.setState({selectedContent: ""})
                return
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.state.showNav?
                <UserNavBar showContent={this.showContent} selectedMenu={this.state.selectedMenu}/>
                :
                ""
                }
                {this.state.selectedContent}
            </React.Fragment>
        )
    }
}

export default UserLoggedInView
