import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';
// import { FaAlignRight } from "react-icons/fa";
import { FaRegUserCircle, FaRegPaperPlane } from "react-icons/fa";
import { MdWallpaper } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { GrSearchAdvanced } from "react-icons/gr";
import {AiOutlineAlignLeft} from 'react-icons/ai';
import SideBar from "../components/SideBar";



export class Navbar extends Component {
    render() {
        let linksMarkup = this.props.navLinks.map(obj => {
            return (
                <li className="menu-list-item" key={obj.key}>
                    {obj.isActive?
                    obj.sidebarViewAvailable?
                        <Link className="menu-link menu-link--active" to={obj.link}
                        onClick={this.props.displaySideView}
                        >{obj.label}</Link>
                        :
                        <Link className="menu-link menu-link--active" to={obj.link}>{obj.label}</Link>
                    :
                    <Link className="menu-link" to={obj.link} 
                    onClick={this.props.selectMenu.bind(this, obj.key)}>
                    {obj.label}
                    </Link>
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
                    {this.props.enableChat?
                    <div className="chat-icon-div">
                        <div className="chat-icon-circle" onClick={this.props.displaySideView}>
                            <FaRegPaperPlane className="nav-icon" />
                        </div>
                        
                    </div>
                    :
                    ""
                    }
                </div>

            </React.Fragment>

        )
    }
}


export class UserNavBar extends Component{
    state = {
        navLinks: [],
        // sidebar required for keys
        sideBarRequiredFor :[3],
        // sidebar states
        showSideView: false,
        sideBarHead: true,
        searchBarRequired: false,
        sideViewContent: [],
    }

    componentDidMount(){
        let navLinks =  [
            { key: 0, label: this.getLabel("leftmenu"), link: '#', isActive: false},
            { key: 1, label: this.getLabel("feeds"), link: '#', isActive: true },
            { key: 2, label: this.getLabel("explore"), link: '/explore/', isActive: false},
            { key: 3, label: this.getLabel("notification"), link: '#', isActive: false, sidebarViewAvailable: true},
            { key: 4, label: this.getLabel("profile"), link: '#', isActive: false},
        ]
        this.setState({
            navLinks: navLinks
        })
    }

    getLabel = (label) =>{
        switch (label) {
            case "feeds":
                return <MdWallpaper className="nav-icon"/>;
            case "explore":
                return <GrSearchAdvanced className="nav-icon"/>;
            case "notification":
                // default is approved tag values
                return <FiBell className="nav-icon"/>;
            case "profile":
                return <FaRegUserCircle className="nav-icon"/>;
            case "leftmenu":
                return <AiOutlineAlignLeft className="nav-icon left-menu" />
            
            default:
                return "WOG"
    
        }

    }

    selectMenu = (key) =>{
        let showSideView = false
        if (this.state.sideBarRequiredFor.includes(key)){
            showSideView = true
        }
        this.setState({
            navLinks: this.state.navLinks.map(item=>{
                if(key=== item.key){
                    item.isActive = true;
                }
                else{
                    item.isActive = false;
                }
                return item
            }),
            showSideView: showSideView
        })

    }
    displaySideView = ({content, sureVal}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            sideBarHead: true,
            

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
                <Navbar navLinks={this.state.navLinks} selectMenu={this.selectMenu} enableChat={true} displaySideView={this.displaySideView}/>
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
