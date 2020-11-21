import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {RiArrowDropDownLine} from 'react-icons/ri';
import {AiFillPlusCircle} from 'react-icons/ai';
import TagUser from '../Profile/TagUser';
import {getCurrentTimeInMS} from '../../utility/Utility';
import w1 from '../../assets/images/wedding1.jpg'
import { UpdateUserPrivacyAPI, GetBlockedUserListAPI, UnBlockUserAPI } from '../../utility/ApiSet';
import { retrieveFromStorage,  saveInStorage} from '../../utility/Utility';
import Paginator, {FillParentContainerSpace} from '../../utility/Paginator';
import OwlLoader from '../OwlLoader';

const option_to_bool = {"enable": true, "disable": false}
const bool_to_option = {true: "enable", false: "disable" }

const updateOption = (key, value) =>{
    UpdateUserPrivacyAPI(key, value, null)
    let newPrivacy = JSON.parse (retrieveFromStorage("user_privacy"))
    newPrivacy[key]=value
    saveInStorage("user_privacy", JSON.stringify(newPrivacy));
}
// PRIVACY MENU OPTIONS

// INTERACTIONS

// Comments
export class Comments extends Component{
    state={
        allowComments: [
            {id: 1, option: "Everyone", selected: true},
            {id: 2, option: "Followers & Following", selected: false},
        ],
        allowCommentsDropdown: false,
        parentState : null
    }

    componentDidMount(){
        let selectedOpt = this.props.selected;
        this.setState({
            allowComments:this.state.allowComments.map(ele=>{
                if (ele.option.toLowerCase() === selectedOpt){
                    console.log("matched with", ele.option)
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        
        })
        
    }


    showAllowCommentsDropDown = () =>{
        this.setState({allowCommentsDropdown : !this.state.allowCommentsDropdown})
    }

    selectfromAllowComments = (idx) => {
        let selectedOpt = null
        this.setState({
            allowComments : this.state.allowComments.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                    selectedOpt = ele.option.toLowerCase()
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })

        if (selectedOpt){

            updateOption("allow_comnets", selectedOpt)
        }

    }

    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Comments"} altBackBtn={true}
            />
                <div className="set-menu select-options" onClick={this.showAllowCommentsDropDown}>
                        <span>Allow Comments From</span>
                        <div className="prev-selected">
                            <span className="selected-text">{this.state.allowComments.filter(ele => ele.selected=== true)[0].option}</span>
                            <RiArrowDropDownLine  className="ico" />
                        </div>
                        {this.state.allowCommentsDropdown?
                            <div className="opt-dropdown">
                                {this.state.allowComments.map(ele => {
                                    return(
                                        <div className="opt-menu" key={ele.id} onClick={this.selectfromAllowComments.bind(this, ele.id)}>
                                            {ele.option}
                                        </div>

                                    )
                                })}
                            </div>
                            : 
                            ""
                        }
                    </div>
            </React.Fragment>
        )
    }
}


// Tags 
export class Tags extends Component{
    state ={
        allowTags: [
            {id: 1, option: "No One", selected: false},
            {id: 2, option: "Followers & Following", selected: true},
            
        ],
        allowTagsDropdown: false,
        approveManually : [
            {id: 1, option: "Enable", selected: false},
            {id: 2, option: "Disable", selected: true},
        ],
        approveManuallyDropdown: false,

    }

    componentDidMount(){
        console.log("allow_tags_manual", this.props.allow_tags_manual)
        this.setState({
            allowTags: this.state.allowTags.map(ele=>{
                if (ele.option.toLowerCase() === this.props.allow_tags){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            }),
            approveManually: this.state.approveManually.map(ele=>{
                if (ele.option.toLowerCase() === bool_to_option[this.props.allow_tags_manual]){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        
        })
    }

    showDropDown = (key) =>{
        if (key === "allowTagsDropdown"){
            this.setState({allowTagsDropdown : !this.state.allowTagsDropdown})
        }
        else if (key === "approveManuallyDropdown"){
            this.setState({approveManuallyDropdown : !this.state.approveManuallyDropdown})
        }
        
    }

    selectfromAllowTags = (idx) => {
        let selectedOpt = null
        this.setState({
            allowTags : this.state.allowTags.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                    selectedOpt = ele.option.toLowerCase()
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })

        if (selectedOpt){

            updateOption("allow_tags", selectedOpt)
        }
    }

    switchManualApprove = (idx) => {
        let selectedOpt = null
        this.setState({
            approveManually : this.state.approveManually.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                    selectedOpt = ele.option.toLowerCase()
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
        if (selectedOpt){

            updateOption("allow_tags_manual", option_to_bool[selectedOpt])
        }

    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Tags"} altBackBtn={true} />

                <div className="set-menu select-options" onClick={this.showDropDown.bind(this, 'allowTagsDropdown')}>
                    <span>Allow Tags From</span>
                    <div className="prev-selected">
                        <span className="selected-text">{this.state.allowTags.filter(ele => ele.selected=== true)[0].option}</span>
                        <RiArrowDropDownLine  className="ico" />
                    </div>
                    {this.state.allowTagsDropdown?
                        <div className="opt-dropdown">
                            {this.state.allowTags.map(ele => {
                                return(
                                    <div className="opt-menu" key={ele.id} onClick={this.selectfromAllowTags.bind(this, ele.id)}>
                                        {ele.option}
                                    </div>
                                )
                            })}
                        </div>
                        : 
                        ""
                    }
                </div>
                <div className="set-menu select-options" onClick={this.showDropDown.bind(this, 'approveManuallyDropdown')}>
                        <span>Approve Tags manually</span>
                        <div className="prev-selected">
                            <span className="selected-text">{this.state.approveManually.filter(ele => ele.selected=== true)[0].option}</span>
                            <RiArrowDropDownLine  className="ico" />
                        </div>
                        {this.state.approveManuallyDropdown?
                            <div className="opt-dropdown">
                                {this.state.approveManually.map(ele => {
                                    return(
                                        <div className="opt-menu" key={ele.id} onClick={this.switchManualApprove.bind(this, ele.id)}>
                                            {ele.option}
                                        </div>

                                    )
                                })}
                            </div>
                            : 
                            ""
                        }
                        
                    </div>

            </React.Fragment>
        )
    }
}

// Mentions
export class Mentions extends Component{
    state = {
        mentionOpt : [
            {id: 1, option: "No One", selected: false},
            {id: 2, option: "Followers & Following", selected: true},
        ],
        openDropdown: false
    }

    componentDidMount(){
        this.setState({
            mentionOpt: this.state.mentionOpt.map(ele=>{
                if (ele.option.toLowerCase() === this.props.selected){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }
    showDropDown = () =>{
        this.setState({openDropdown : !this.state.openDropdown})
    }

    selectoption = (idx) => {
        let selectedOpt = null;
        this.setState({
            mentionOpt : this.state.mentionOpt.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                    selectedOpt = ele.option.toLowerCase()
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
        if (selectedOpt){

            updateOption("allow_mentions", selectedOpt)
        }
    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Mentions"} altBackBtn={true} />

                <div className="set-menu select-options" onClick={this.showDropDown}>
                    <span>Allow Mentions From</span>
                    <div className="prev-selected">
                        <span className="selected-text">{this.state.mentionOpt.filter(ele => ele.selected=== true)[0].option}</span>
                        <RiArrowDropDownLine  className="ico" />
                    </div>
                    {this.state.openDropdown?
                        <div className="opt-dropdown">
                            {this.state.mentionOpt.map(ele => {
                                return(
                                    <div className="opt-menu" key={ele.id} onClick={this.selectoption.bind(this, ele.id)}>
                                        {ele.option}
                                    </div>
                                )
                            })}
                        </div>
                        : 
                        ""
                    }
                </div>

            </React.Fragment>
        )
    }
}



// CONNECTIONS
// AccountPrivacy
export class AccountPrivacy extends Component{
    state = {
        options : [
            {id: 1, option: "Enable", selected: false},
            {id: 2, option: "Disable", selected: true},
        ],
        openDropdown: false
    }

    componentDidMount(){
        this.setState({
            options: this.state.options.map(ele=>{
                if (ele.option.toLowerCase() === bool_to_option[this.props.selected]){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }

    showDropDown = () =>{
        this.setState({openDropdown : !this.state.openDropdown})
    }

    selectoption = (idx) => {
        let selectedOpt = null
        this.setState({
            options : this.state.options.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                    selectedOpt = ele.option.toLowerCase()
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
        if (selectedOpt){

            updateOption("is_private_ac", option_to_bool[selectedOpt] )
        }
    }
    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Account Privacy"} altBackBtn={true} />

                <div className="set-menu select-options" onClick={this.showDropDown}>
                    <span>Private Account</span>
                    <div className="prev-selected">
                        <span className="selected-text">{this.state.options.filter(ele => ele.selected=== true)[0].option}</span>
                        <RiArrowDropDownLine  className="ico" />
                    </div>
                    {this.state.openDropdown?
                        <div className="opt-dropdown">
                            {this.state.options.map(ele => {
                                return(
                                    <div className="opt-menu" key={ele.id} onClick={this.selectoption.bind(this, ele.id)}>
                                        {ele.option}
                                    </div>
                                )
                            })}
                        </div>
                        : 
                        ""
                    }
                </div>

            </React.Fragment>

        )
    }
}

// Blocked Accounts
export class BlockedAccounts extends Component{
    state ={
        blockedUsers: null,
        paginator: null,
        isFetching: false
    }

    componentDidMount(){
        GetBlockedUserListAPI(this.updateStateOnAPIcall)
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            blockedUsers: data.results,
            paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null,
        },
        ()=>{FillParentContainerSpace("side-bar-content", "settings-container", this.state.paginator, this.checkIfFetching, this.updateIfFeching)}
        )
    }

    checkIfFetching = () => {
        return this.state.isFetching
    }

    updateIfFeching = (val) =>{
        this.setState({isFetching: val})
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator && this.state.paginator.next){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            blockedUsers:[...this.state.data, ...results],
            isFetching: false
        })
    }
    

    unBolockRequest = (idx) =>{
        // unblock user if blocked
        this.setState({
            blockedUsers : this.state.blockedUsers.filter(ele=> ele.id!==idx)
        })
        UnBlockUserAPI(idx)
    }

    render(){
        if(!this.state.blockedUsers) return(<React.Fragment><OwlLoader /></React.Fragment>)
        let userList = []
        this.state.blockedUsers.map( item =>{
            userList.push(<TagUser key={item.id} data={item} allowUnblock={this.unBolockRequest}/>)
            return item
                
        })
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Blocked Accounts"} altBackBtn={true} />
                {userList}
            </React.Fragment>
        )
    }
}


// Close Friends
export class CloseFriends extends Component{
    state ={
        closeFriends:[
            {id:1, name: "John Doe", username: "Johndoe", designation: "photographer", profile_pic: w1},
            {id:2, name: "Jane Doe", username: "Johndoe", designation: "makeup artist", profile_pic: w1}
        ]
    }

    removeUser = (idx) =>{
        // unblock user if blocked
        this.setState({
            closeFriends : this.state.closeFriends.filter(ele=> ele.id!==idx)
        })
    }

    render(){
        let userList = []
        this.state.closeFriends.map( item =>{
            userList.push(<TagUser key={item.id} data={item} onRemoveMember={this.removeUser}/>)
            return item
                
        })
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Close Friends"} altBackBtn={true} />
                {userList}
            </React.Fragment>
        )
    }
}


export class ManageMails extends Component{
    state ={
        mails: [
            {'id': 1, "email": "souvik.nandy@nevaehtech.com", "default": false},
            {'id': 2, "email": "souvikpxnandy@gmail.com", "default": true},
            {'id': 3, "email": "souvik.nandy@getnadat.com", "default": false},
        ],
        addMailBox: false,
    }
    setDefault = (idx) =>{
        this.setState({
            mails: this.state.mails.map(ele=>{
                if(ele.id === idx){
                    ele.default = true
                }
                else{
                    ele.default = false
                }
                return ele
            })
        })
    }

    removeMail = (idx) =>{
        this.setState({mails: this.state.mails.filter(ele => ele.id!==idx)})
    }

    allowAddMail = () =>{
        this.setState({allowAddMail: !this.state.allowAddMail})
    }
    addNewMail = () =>{
        let ele = document.getElementById("new-mail-id");
        if(ele.value === ""){
            return false
        }
        let newRecord = {
            id: getCurrentTimeInMS(),
            email: ele.value,
            default: false
        }
        this.setState({
            mails: [newRecord, ...this.state.mails]
        })
        ele.value = ""

    }

    render(){
        return(
            <React.Fragment>
                <SideBarHead displaySideView ={this.props.prvBtnClick} searchBarRequired={false} 
                altHeadText={"Manage Mails"} altBackBtn={true} />
                <div className="manage-mail-conatainer">
                    <div className="default-mail">
                        <label>Email</label>
                        <span className="email-id">
                            {this.state.mails.filter(ele=> ele.default===true)[0].email}
                        </span>
                    </div>
                    <div className="add-new" >
                        
                        {this.state.allowAddMail?
                            <React.Fragment>
                                <span onClick={this.allowAddMail}>Cancel Adding New Email</span>
                                <div className="add-email">
                                    <input placeholder="Enter a new email" id="new-mail-id"></input>
                                    <AiFillPlusCircle className="ico" onClick={this.addNewMail}/>
                                </div>
                            </React.Fragment>
                            :
                            <span onClick={this.allowAddMail}>Add New Email</span>
                        }
                        
                        
                        
                    </div>
                    <div className="other-mails">
                        <div className="set-menu-label">Other Registered E-mails</div>
                        {this.state.mails.filter(ele=> ele.default!==true).map(ele=>{
                            return(
                                <div className="non-default">
                                    <span className="email-id">{ele.email}</span>
                                    <div className="action-section">
                                        <span className="btn-anc" onClick={this.setDefault.bind(this, ele.id)}>Set Default</span>
                                        <span className="btn-anc" onClick={this.removeMail.bind(this, ele.id)}>Remove</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
export default {Comments, Tags, Mentions, AccountPrivacy, BlockedAccounts, CloseFriends, ManageMails}