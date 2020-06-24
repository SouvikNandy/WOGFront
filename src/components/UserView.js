import React from 'react';

import "../assets/css/userview.css";


export function UserFlat(props){
        const ele = props.data
        return(
            <div className="user-flat-div">
                <span key={ele.id}><img className="tag-img" src={ele.profile_pic} alt={ele.username}/></span>
                <span className="m-display-name">
                    {ele.name} @{ele.username}<br />
                    <span className="m-adj">{ele.designation}</span>
                </span>
            </div>
        )
}


export default {UserFlat} 
