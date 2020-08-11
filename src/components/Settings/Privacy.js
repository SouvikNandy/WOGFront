import React, { Component } from 'react';
import {SideBarHead} from '../SideBar';
import {FaRegComment, FaUserTag} from 'react-icons/fa';
import {GoMention, GoCircleSlash} from 'react-icons/go';
import {FiUnlock} from 'react-icons/fi';
import {AiOutlineHeart} from 'react-icons/ai';
import {RiArrowDropDownLine} from 'react-icons/ri'


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
            {id: 'p6', name: "Blocked Accounts", isActive: false},
            {id: 'p7', name: "Close Friends", isActive: false},
        ]

    }

    selectMenu = (idx) =>{
        let newMenulist = [...this.state.interactions, ...this.state.connections] ;
        let newContentblock = null
        let headText = ''
        newMenulist.map(ele =>{
            if(ele.id === idx){
                ele.isActive = true
                headText = ele.name
                if(ele.name === "Comments"){
                    // contentBlock
                    newContentblock = <Comments prvBtnClick={this.prvBtnClick}/>
                    
                }
                else if (ele.name === "Tags"){
                    newContentblock = <Tags  prvBtnClick={this.prvBtnClick}/>
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


// PRIVACY MENUS

// Comments
class Comments extends Component{
    state={
        allowComments: [
            {id: 1, option: "Everyone", selected: true},
            {id: 2, option: "Followers & Following", selected: false},
            {id: 3, option: "People You Follow", selected: false},
            {id: 4, option: "Your Followers", selected: false},
        ],
        allowCommentsDropdown: false,
    }

    showAllowCommentsDropDown = () =>{
        this.setState({allowCommentsDropdown : !this.state.allowCommentsDropdown})
    }

    selectfromAllowComments = (idx) => {
        this.setState({
            allowComments : this.state.allowComments.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
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
class Tags extends Component{
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

    showDropDown = (key) =>{
        if (key === "allowTagsDropdown"){
            this.setState({allowTagsDropdown : !this.state.allowTagsDropdown})
        }
        else if (key === "approveManuallyDropdown"){
            this.setState({approveManuallyDropdown : !this.state.approveManuallyDropdown})
        }
        
    }

    selectfromAllowTags = (idx) => {
        this.setState({
            allowTags : this.state.allowTags.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
    }

    switchManualApprove = (idx) => {
        this.setState({
            approveManually : this.state.approveManually.map(ele =>{
                if(ele.id === idx){
                    ele.selected = true
                }
                else{
                    ele.selected = false
                }
                return ele
            })
        })
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

export default Privacy
