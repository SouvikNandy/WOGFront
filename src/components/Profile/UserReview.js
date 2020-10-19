import React, { Component } from 'react';
import '../../assets/css/profile.css';
import Subnav from '../components/Subnav';
import NoContent from '../components/NoContent';

export class UserReview extends Component {
    state ={
        navOptions: [
            {key: "urn-1", "title": "On You", "isActive": true},
            {key: "urn-2", "title": "From You", "isActive": false}
        ],
        fromUser:[],
        onUser:[]
    }

    selectSubMenu = (key) =>{
        // select a submenu
        this.setState({
            navOptions: this.state.navOptions.map(item=>{
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

    getNoContentDiv = (msg)=>{
        return(
            <div className="no-content-render">
                <NoContent message={msg} />
            </div>
        )

    }

    getCompomentData = () =>{
        let result = [];
        this.state.navOptions.map((item, index) => {
            if(item.title === "On You" && item.isActive === true){
                if (this.state.onUser.length === 0){
                    let msg = "No reviews yet !!!"
                    result = this.getNoContentDiv(msg)
                }
                else{
                    result = []
                    
                }


            }
            else{
                if (this.state.fromUser.length === 0){
                    let msg = "No reviews yet !!!"
                    result = this.getNoContentDiv(msg)
                }
                else{
                    result = []
                }

            }
            return item
        }
    )
    return result
}

    render() {
        let resultList = this.getCompomentData()
        // console.log("result List ", resultList);
        return (
            <React.Fragment>
                <div className="profile-tags-selector">
                    <Subnav subNavList={this.state.navOptions} selectSubMenu={this.selectSubMenu} />
                </div>
                <div className="profile-portfolio-grid">
                    {resultList}
                </div>
            </React.Fragment>
        )
    }
}

export default UserReview
