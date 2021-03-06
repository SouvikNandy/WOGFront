import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/navbar.css';
// import { FaAlignRight } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdWallpaper } from "react-icons/md";

import { FiCompass } from "react-icons/fi";
import {AiOutlineAlignRight, AiOutlineAlignLeft} from 'react-icons/ai';
import SideBar from "../SideBar";
import {NewsFeedUserMenu} from "../../pages/NewsFeeds";
import NotificationButton from '../NotificationButton';
import ChatMainButton from '../ChatModule/ChatMainButton';
import { RecentChats } from '../Profile/RecentFriends';



export class Navbar extends Component {
    render() {
        let linksMarkup = this.props.navLinks.map(obj => {
            return (
                <li className="menu-list-item" key={obj.key}>
                    {obj.isActive?
                    <React.Fragment>
                        <div className="menu-link--active"></div>
                        {obj.name==="notification-btn"?
                            <div className="menu-link" id={obj.id?obj.id: ""}>{obj.label}</div>
                            :
                            <Link className="menu-link" to={obj.link} id={obj.id?obj.id: ""}>{obj.label}</Link>
                        }
                    </React.Fragment>
                    :
                    obj.name==="notification-btn"?
                        <div className="menu-link" id={obj.id?obj.id: ""}>{obj.label}</div>
                        :
                        obj.name ==="leftmenu"?
                        <div className="menu-link" id={obj.id?obj.id: ""} onClick={this.props.displaySidePanel.bind(this, obj.key)}>{obj.label}</div>
                        :
                        <Link className="menu-link" to={obj.link} id={obj.id?obj.id: ""}>{obj.label}</Link>
                    
                    
                    }
                </li>
                )
        })

        let menuClass = "menu-right"

        return (
            <React.Fragment>
                <div className="nav-container center">
                    <nav className="menu">
                        <div className="menu-logo" />
                        <div className={menuClass} id="menu_right">
                            <ul className="menu-list">
                                {linksMarkup}
                            </ul>
                        </div>
                    </nav>
                    {this.props.getChatButton?
                        this.props.getChatButton(this.props.displaySideView.bind(this, {content: <RecentChats onClose={this.props.displaySideView}/>}))
                        :
                        ""
                    }
                </div>

            </React.Fragment>

        )
    }
}


export class PublicNavBar extends Component{
    state = {
        navLinks: [
            { key: 1, label: "Home", link: '/', isActive: true },
            { key: 2, label: "Explore", link: '/explore/', isActive: false},
            { key: 3, label: "Register", link: '/signup/', isActive: false},
            { key: 4, label: "Login", link: '/signin/', isActive: false},
        ],
    }
    componentDidMount(){
        if(this.props.defaultActive === false){
            this.setState({
                navLinks: this.state.navLinks.map( ele => {
                    ele.isActive = false
                    return ele
                })
            })
        }
    }
    selectMenu = (key) =>{
        this.setState({
            navLinks: this.state.navLinks.map(item=>{
                if(key=== item.key){
                    item.isActive = true;
                }
                else{
                    item.isActive = false;
                }
                return item
            })
        })

    }
    render(){
        return(
            <React.Fragment>
                <Navbar navLinks={this.state.navLinks} selectMenu={this.selectMenu} />
            </React.Fragment>
        )
    }
}

export class UserNavBar extends Component{
    state = {
        navLinks: [],
        // sidebar states
        showSideView: false,
        sideBarHead: false,
        searchBarRequired: false,
        sideViewContent: [],
        isMounted: false
    }

    componentDidMount(){
        let selectedMenu = this.props.selectedMenu;
        //console.log("selected menu", selectedMenu);
        let navLinks =  [
            { key: 1, name: "feeds", id: "m-feeds", label: this.getLabel("feeds"), link: `/user-feeds/${this.props.username}`, 
            isActive: selectedMenu && selectedMenu!=="feeds"? false: true  },
            { key: 2, name: "explore", id: "m-explore", label: this.getLabel("explore"), link: '/explore/', isActive: false},
            { key: 3, name: "notification-btn", id: "m-notification",  label: this.getLabel("notification"), 
            link: '#', isActive: selectedMenu==="notification"? true: false},
            { key: 4, name: "profile", id: "m-profile", label: this.getLabel("profile"), link: `/user-profile/${this.props.username}`, 
            isActive: selectedMenu==="profile"? true: false},
            { key: 6, name: "leftmenu", id: "m-leftmenu",  label: this.getLabel("leftmenu"), link: '#', isActive: false},
        ]

        this.setState({
            navLinks: navLinks,
            isMounted: true
        })
    }

    getLabel = (label) =>{
        switch (label) {
            case "feeds":
                return <MdWallpaper className="nav-icon"/>;
            case "explore":
                return <FiCompass className="nav-icon"/>;
            case "notification":
                // default is approved tag values
                return <NotificationButton {...this.props} />;
            case "profile":
                return <FaRegUserCircle className="nav-icon"/>;
            case "leftmenu":
                return <AiOutlineAlignRight className="nav-icon left-menu" />
            
            default:
                return "WOG"
        }

    }
    getChatButton =(onClickMethod) =>{
        if(this.state.isMounted) return (<ChatMainButton onClick={onClickMethod}/>)
        else return false
    }

    sideNFMenu = () =>{
        return(
            <div className="side-nfuser-menu">
                <AiOutlineAlignLeft className="nav-icon hide-left-menu" onClick={this.displaySideView}/>
                <NewsFeedUserMenu />
            </div>
        )
    }

    displaySidePanel = (key) =>{
        // if (window.innerWidth < 800){
            this.setState({
                showSideView: true,
                sideViewContent: this.sideNFMenu()
            })

        // }
            
    }
    displaySideView = ({content, sureVal}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            // sideBarHead: true,
            
        })

        if(content){
            this.setState({
                sideViewContent: content
            })
        }
        
    }
    render(){
        return(
            <React.Fragment>
                <Navbar navLinks={this.state.navLinks} displaySidePanel={this.displaySidePanel} getChatButton={this.getChatButton} displaySideView={this.displaySideView}/>
                {this.state.showSideView?
                <div className="form-side-bar-view side-bar-view-active">
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent} 
                    searchPlaceHolder={this.state.searchPlaceHolder} sideBarHead={this.state.sideBarHead}
                    searchBarRequired={this.state.searchBarRequired}/>
                </div>
                :
                <div className="form-side-bar-view"></div>
                }
            </React.Fragment>
        )

    }
}

export default Navbar
