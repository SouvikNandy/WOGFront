import React, { Component } from 'react';

import "../assets/css/sidebar.css";
import {UserFlat} from "../components/UserView";
import { AiFillCloseCircle } from 'react-icons/ai';
// import { FaPlus } from 'react-icons/fa';

export class TagUser extends Component{
    render(){
        return(
            <div className="tag-user-div">
                <span className="user-f">
                    <UserFlat data={this.props.data}/>
                </span>
                
                {/* <span className="m-follow">
                    <button className="btn m-fuser">< FaPlus /> Follow</button>
                </span> */}
                <AiFillCloseCircle className="close-btn" onClick={this.props.onRemoveMember.bind(this, this.props.data.id)}/>
            </div>
        )
    }
    

    }
    
export default TagUser;


