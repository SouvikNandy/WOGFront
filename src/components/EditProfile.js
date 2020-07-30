import React, { Component } from 'react';
import '../assets/css/editprofile.css';
import Subnav from '../components/Subnav';

export class EditProfile extends Component {
    state ={
        SubNavOptions:[
            {key: "E-1", title: "Basic", isActive: true},
            {key: "E-2", title: "Social", isActive: false},
            {key: "E-3", title: "Skills & Teams", isActive: false},

        ],
    }

    selectSubNavMenu = (key) =>{
        this.setState({
            SubNavOptions: this.state.SubNavOptions.map(item=>{
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

    pageContent = () =>{
        let contentBlock = []
        this.state.SubNavOptions.map(ele=>{
            if(ele.title === "Basic" && ele.isActive === true){
                contentBlock.push(
                    <React.Fragment>
                        <div className="upld-pic">


                        </div>

                    </React.Fragment>
                    
                )

            };
            // elif (ele.title === "Social" && ele.isActive === true){

            // };
            // elif(ele.title === "Skills & Teams" && ele.isActive === true){

            // };
            return ele
        })
    }

    render() {
        return (
            <div className="edit-profile-overlay">
                <div className="edit-profile-container">
                    <div className="edit-options">
                        <Subnav subNavList={this.state.SubNavOptions} selectSubMenu={this.selectSubNavMenu}/>
                    </div>
                    <div className="content-div">
                        {this.pageContent()}
                    </div>

                </div>
                
            </div>
        )
    }
}

export default EditProfile
