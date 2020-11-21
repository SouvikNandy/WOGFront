import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {FaRegComment, FaUserTag} from 'react-icons/fa';
import {GoMention, GoCircleSlash, GoMail} from 'react-icons/go';
import {FiUnlock} from 'react-icons/fi';
import {AiOutlineHeart} from 'react-icons/ai';
import {Comments, Tags, Mentions, AccountPrivacy, BlockedAccounts, CloseFriends, ManageMails} from './PrivacyOptions';
import { retrieveFromStorage } from '../../utility/Utility';


export class Privacy extends Component {
    state = {
        interactions : [
            {id: 'p1', name: "Comments", isActive: false},
            {id: 'p2', name: "Tags", isActive: false},
            {id: 'p3', name: "Mentions", isActive: false},
            // {id: 'p4', name: "Activity status", isActive: false},
        ],
        connections : [
            {id: 'p5', name: "Account Privacy", isActive: false},
            {id: 'p8', name: "Manage Mails", isActive: false},
            {id: 'p6', name: "Blocked Accounts", isActive: false},
            // {id: 'p7', name: "Close Friends", isActive: false},
        ],

    }


    selectMenu = (idx) =>{
        let newMenulist = [...this.state.interactions, ...this.state.connections] ;
        let newContentblock = null
        let headText = ''
        let storedPrivacy = JSON.parse (retrieveFromStorage("user_privacy"))
        newMenulist.map(ele =>{
            if(ele.id === idx){
                ele.isActive = true
                headText = ele.name
                // interactions
                if(ele.name === "Comments"){
                    newContentblock = <Comments prvBtnClick={this.prvBtnClick}  
                    selected={storedPrivacy.allow_comnets}
                    />
                }
                else if (ele.name === "Tags"){
                    newContentblock = <Tags  prvBtnClick={this.prvBtnClick} 
                    allow_tags={storedPrivacy.allow_tags}
                    allow_tags_manual={storedPrivacy.allow_tags_manual}
                    />
                }
                else if (ele.name === "Mentions"){
                    newContentblock = <Mentions  prvBtnClick={this.prvBtnClick} 
                    selected={storedPrivacy.allow_mentions}
                    />
                }
                // connections
                else if (ele.name === "Account Privacy"){
                    newContentblock = <AccountPrivacy  prvBtnClick={this.prvBtnClick} 
                    selected={storedPrivacy.is_private_ac}
                    />
                }
                else if (ele.name === "Manage Mails"){
                    newContentblock = <ManageMails  prvBtnClick={this.prvBtnClick}/>
                }

                else if (ele.name === "Blocked Accounts"){
                    newContentblock = <BlockedAccounts  prvBtnClick={this.prvBtnClick}/>
                }
                else if (ele.name === "Close Friends"){
                    newContentblock = <CloseFriends  prvBtnClick={this.prvBtnClick}/>
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
            case "Comments":
                return <FaRegComment className="ico" />;
            case "Tags":
                return <FaUserTag className="ico" />
            case "Mentions":
                return <GoMention className="ico" />

            case "Account Privacy":
                return <FiUnlock className="ico" />
            case "Manage Mails":
                return <GoMail className="ico" />
            case "Blocked Accounts":
                return <GoCircleSlash className="ico" />
            case "Close Friends":
                return <AiOutlineHeart className="ico" />
            default:
                return ''
        }
    }
    prvBtnClick = () =>{
        this.props.updateContentBlock({
            headText: "Privacy",
            content: this.defaultContent(),
        })

    }

    defaultContent = () =>{
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false}  altHeadText={"Privacy"} altBackBtn={true} />
               <div className="set-menu-label">Interactions</div>
                {this.state.interactions.map(ele =>{
                    return(
                    <div className="set-menu" key={ele.id} onClick={this.selectMenu.bind(this, ele.id)}>
                        {this.getIcon(ele.name)}
                        <span>{ele.name}</span>
                    </div>)
                })}
                <div className="set-menu-label">Connections</div>
                {this.state.connections.map(ele =>{
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

export default Privacy
