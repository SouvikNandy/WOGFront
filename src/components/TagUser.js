import React, { Component } from 'react';

import "../assets/css/sidebar.css";
import {UserFlat} from "../components/UserView";
import { AiFillCloseCircle } from 'react-icons/ai';
// import { FaPlus } from 'react-icons/fa';

export class TagUser extends Component{
    render(){
        let data = this.props.data 
        return(
            <div className="tag-user-div">
                <span className="user-f">
                    <UserFlat data={data}/>
                </span>
                
                {/* <span className="m-follow">
                    <button className="btn m-fuser">< FaPlus /> Follow</button>
                </span> */}
                <AiFillCloseCircle className="close-btn tag-div-btn" onClick={this.props.onRemoveMember.bind(this, data.id)}/>
            </div>
        )
    }
    

    }
    
export default TagUser;


