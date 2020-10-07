import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {FaMapMarkerAlt, FaRegUser} from 'react-icons/fa';
import {FiKey, FiDownload} from 'react-icons/fi';
import {RiSearchEyeLine} from 'react-icons/ri';

import {ChangePassword, LoginActivity, AccountData, ConfirmationPopup, SearchHistory} from './SecurityOptions';


export class Security extends Component {
    state = {
        login : [
            {id: 's1', name: "Change Password", isActive: false},
            {id: 's2', name: "Login Activity", isActive: false},
            // {id: 's3', name: "Two-Factor Authentication", isActive: false},
        ],
        history : [
            {id: 's5', name: "Account Data", isActive: false},
            {id: 's6', name: "Download Data", isActive: false},
            {id: 's7', name: "Search History", isActive: false},
        ]

    }

    selectMenu = (idx) =>{
        let newMenulist = [...this.state.login, ...this.state.history] ;
        let newContentblock = null
        let headText = ''
        newMenulist.map(ele =>{
            if(ele.id === idx){
                ele.isActive = true
                headText = ele.name
                // login
                if(ele.name === "Change Password"){
                    newContentblock = <ChangePassword prvBtnClick={this.prvBtnClick}/>
                }
                else if (ele.name === "Login Activity"){
                    newContentblock = <LoginActivity  prvBtnClick={this.prvBtnClick}/>
                }
                // data and history
                else if (ele.name === "Account Data"){
                    newContentblock = <AccountData  prvBtnClick={this.prvBtnClick}/>
                }
                else if (ele.name === "Download Data"){
                    newContentblock = <ConfirmationPopup  prvBtnClick={this.prvBtnClick}/>
                }
                else if (ele.name === "Search History"){
                    newContentblock = <SearchHistory  prvBtnClick={this.prvBtnClick}/>
                }
                
            }
            else{
                ele.isActive = false
            }
            return ele
        })

        this.props.updateContentBlock({
            headText: headText,
            content: newContentblock,
        })

    }

    getIcon = (name) =>{
        switch(name){
            case "Change Password":
                return <FiKey className="ico" />;
            case "Login Activity":
                return <FaMapMarkerAlt className="ico" />


            case "Account Data":
                return <FaRegUser className="ico" />
            case "Download Data":
                return <FiDownload className="ico" />
            case "Search History":
                return <RiSearchEyeLine className="ico" />
            default:
                return ''
        }
    }
    prvBtnClick = () =>{
        this.props.updateContentBlock({
            headText: "Security",
            content: this.defaultContent(),
        })

    }

    defaultContent = () =>{
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false}  altHeadText={"Security"} altBackBtn={true} />
               <div className="set-menu-label">Login Security</div>
                {this.state.login.map(ele =>{
                    return(
                    <div className="set-menu" key={ele.id} onClick={this.selectMenu.bind(this, ele.id)}>
                        {this.getIcon(ele.name)}
                        <span>{ele.name}</span>
                    </div>)
                })}
                <div className="set-menu-label">Data and History</div>
                {this.state.history.map(ele =>{
                    return(
                    <div className="set-menu" key={ele.id} onClick={this.selectMenu.bind(this, ele.id)}>
                        {this.getIcon(ele.name)}
                        <span>{ele.name}</span>
                    </div>)
                })}
            </React.Fragment>
        )

    }

    render() {
        return (
            <React.Fragment>
                {this.defaultContent()}
            </React.Fragment>
        )
    }
}

export default Security
