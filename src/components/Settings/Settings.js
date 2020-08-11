import React, { Component } from 'react';
import "../../assets/css/settings.css";
import {FiUnlock} from 'react-icons/fi';
import {RiShieldFlashLine} from 'react-icons/ri';
import {SideBarHead} from '../SideBar';
import Privacy from './Privacy';

export class Settings extends Component {
    state ={
        headText: 'Settings',
        menuList : [
            {id: 1, name: "Privacy", isActive: false},
            {id: 2, name: "Security", isActive: false},
        ],
        contentBlock : null
    }
    selectMenu = (idx) =>{
        let newMenulist = this.state.menuList;
        let newContentblock = null
        let headText = ''
        newMenulist.map(ele =>{
            if(ele.id === idx){
                ele.isActive = true
                headText = ele.name
                if(ele.name === "Privacy"){
                    // contentBlock
                    newContentblock = <Privacy updateContentBlock={this.updateContentBlock} prvBtnClick={this.prvBtnClick} />
                    
                }
                else if (ele.name === "Security"){
                    newContentblock = null
                }
            }
            else{
                ele.isActive = false
            }
            return ele
        })

        this.setState({
            menuList: newMenulist,
            contentBlock: newContentblock,
            headText: headText 
        })

    }

    getHead = () =>{
        if(this.state.headText=== 'Settings'){
            return <SideBarHead displaySideView ={this.props.displaySideView} searchBarRequired={false} altHeadText={'Settings'}/>
        }
        else{
            return null
        }
        
    }

    prvBtnClick = () =>{
        this.setState({
            contentBlock: this.defaultContent(),
            headText: "Settings"
        })

    }

    getIcon = (name) =>{
        switch(name){
            case "Privacy":
                return <FiUnlock className="ico" />;
            case "Security":
                return <RiShieldFlashLine className="ico" />
            default:
                return ''
        }
    }

    updateContentBlock = ({headText, content}) =>{
        this.setState({
            headText: headText,
            contentBlock: content
        })
    }

    defaultContent = () =>{
        return(
            <React.Fragment>
                {this.state.menuList.map(ele =>{
                    return(
                        <div className="set-menu" key={ele.id} onClick={this.selectMenu.bind(this, ele.id)}>
                            {this.getIcon(ele.name)}
                            <span>{ele.name}</span>
                        </div>
                    )
                })}
            </React.Fragment>
        )

    }

    getContent = () =>{
        if (this.state.contentBlock){
            return (
                <React.Fragment>
                    {this.state.contentBlock}
                </React.Fragment>
                )
        }
        else{
            return (
                <React.Fragment>
                    {this.defaultContent()}
                </React.Fragment>
                )
        }
    }

    render() {
        return (
            <div className="settings-container">
                {this.getHead()}
                {/* <SideBarHead displaySideView ={this.props.displaySideView} searchBarRequired={false} altHeadText={'Settings'}/> */}
                {this.getContent()}
            </div>
        )
    }
}

export default Settings
