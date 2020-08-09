import React, { Component } from 'react';

import "../../assets/css/sidebar.css";
import {UserFlat} from "./UserView";
import { AiFillCloseCircle, AiFillPlusCircle} from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

export class TagUser extends Component{
    render(){
        let data = this.props.data 
        return(
            <div className="tag-user-div">
                <span className="user-f">
                    <UserFlat data={data}/>
                </span>
                
                {this.props.allowFollow?
                <span className="m-follow">
                    <button className="btn m-fuser">< FaPlus /> Follow</button>
                </span>
                :
                ""
                }
                
                {this.props.onRemoveMember?
                    <AiFillCloseCircle className="close-btn tag-div-btn" onClick={this.props.onRemoveMember.bind(this, data.id)}/>
                    :
                    ""
                }
                {this.props.onAddMember?
                    <AiFillPlusCircle className="close-btn tag-div-btn add-fill" onClick={this.props.onAddMember.bind(this, data.id)}/>
                    :
                    ""
                }

                
            </div>
        )
    }
    

    }
    
export default TagUser;


