import React, { Component } from 'react';
import "../../assets/css/settings.css";
import {FiUnlock} from 'react-icons/fi';
import {RiShieldFlashLine} from 'react-icons/ri'

export class Settings extends Component {
    state ={
        menuList : [
            {id: 1, name: "privacy", isActive: false},
            {id: 2, name: "security", isActive: false},
        ],
        contentBlock : null
    }
    selectMenu = (idx) =>{

        // let newMenulist = this.state.menuList;
        this.setState({
            menuList: this.state.menuList.map(ele=>{
                if(ele.id === idx){
                    ele.isActive = true

                    if(ele.name === "privacy"){
                        // contentBlock
                    }
                }
                else{
                    ele.isActive = false
                }
                return ele
            })
        })

    }

    getContent = () =>{
        let resultBlock = [];
        let activeMenu = this.state.menuList.filter(ele => ele.isActive===true)
        console.log(activeMenu)

        if (activeMenu.length > 0){
            console.log("activeMenu", activeMenu);
            let ele = activeMenu[0]
            if(ele.name === "privacy" && ele.isActive === true){

            }
            else if(ele.name === "security" && ele.isActive === true){
        
            }

        }
        else{
            resultBlock.push(
                <React.Fragment>
                    <div className="set-menu" onClick={this.selectMenu.bind(this, 1)}>
                        <FiUnlock className="ico" />
                        <span>Privacy</span>
                    </div>
                    <div className="set-menu" onClick={this.selectMenu.bind(this, 2)}>
                        <RiShieldFlashLine className="ico" />
                        <span>Security</span>
                    </div>
                </React.Fragment>
            )

        }
        return resultBlock

    }

    render() {
        return (
            <div className="settings-container">
                {this.getContent()}
            </div>
        )
    }
}

export default Settings
