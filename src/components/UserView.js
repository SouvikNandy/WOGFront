import React from 'react';

import "../assets/css/userview.css";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
// import w1 from "../assets/images/wedding1.jpg";


export function UserFlat(props){
        const ele = props.data
        return(
            <Link className="link user-flat-div" to={{pathname: `/profile/${ele.username}`}}>
                <span key={ele.id}><img className="tag-img" src={ele.profile_pic} alt={ele.username}/></span>
                <span className="m-display-name">
                    {ele.name} @{ele.username}<br />
                    <span className="m-adj">{ele.designation}</span>
                </span>
            </Link>
        )
}

export function UserCube(props){
    let ele = props.data;
    return(
            <Link className="link cube-user-attr" to={{pathname: `/profile/${ele.username}`}}>
                <div key={ele.id}><img className="cube-user-img " src={ele.profile_pic} alt={ele.username}/></div>
                <span className="m-display-name">
                    {ele.name}
                    <span className="m-adj">@{ele.username}</span>
                    <span className="m-adj">{ele.designation}</span>
                </span>
            </Link>
    )

}

export function FollowUserCube(props){
    // const ele = {"id": 1, "name":"First Last", "username": "user1", "profile_pic": w1, "designation": "photographer"}
    const ele = props.data;
    const is_following = props.isFollowing? true: false
    return(
        <div className="user-cube-div">
            <div className="cube-grid">
                <UserCube data={ele} />
                <div className="cube-user-prof">
                    {is_following?
                    <div className="cu-prof-details">
                        <div className="cu-portfolio">
                            <span className="cu-p-title">Shots</span>
                            <span className="cu-p-content">10</span>
                        </div>
                        <div className="cu-tags">
                        <span className="cu-p-title">Tags</span>
                            <span className="cu-p-content">10</span>
                        </div>
                        <div className="cu-followers">
                        <span className="cu-p-title">Followers</span>
                            <span className="cu-p-content">10</span>
                        </div>
                    </div>
                    :
                    <button className="btn m-fuser" onClick={() => props.startFollowing(ele)}>< FaPlus /> Follow</button>}
                    
                </div>
                
            </div>
        </div>
    )
}

export default {UserFlat, UserCube,  FollowUserCube} 
