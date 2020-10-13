import React from 'react';

import "../../assets/css/userview.css";
import { Link } from "react-router-dom";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { FollowRequestAPI } from '../../utility/ApiSet';
import { UpdateRecentFriends } from '../../utility/userData';
// import w1 from "../assets/images/wedding1.jpg";


export function UserFlat(props){
        const ele = props.data
        return(
                <div className="user-flat-div" >
                    {props.redirectPage === false?
                    <React.Fragment>
                        <div className="link" key={ele.username}>
                            {ele.profile_pic?
                                <img className="tag-img" src={ele.profile_pic} alt={ele.username}/>
                                :
                                <FaUserCircle className="tag-img default-user-logo" />
                            }
                        </div>
                        <div className="link m-display-name" >
                            <div className="head-name">
                                <span className="main-title">{ele.name}</span> 
                                <span className="u-name">@{ele.username}</span>
                            </div>
                            <span className="m-adj">{props.tagText?props.tagText:ele.profession}</span>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <Link to={{pathname: `/profile/${ele.username}`}} className="link" key={ele.username}>
                            {ele.profile_pic?
                                <img className="tag-img" src={ele.profile_pic} alt={ele.username}/>
                                :
                                <FaUserCircle className="tag-img default-user-logo" />
                            }
                        </Link>
                        <Link className="link m-display-name" to={{pathname: `/profile/${ele.username}`}}>
                            <div className="head-name">
                                <span className="main-title">{ele.name}</span> 
                                <span className="u-name">@{ele.username}</span>
                            </div>
                            <span className="m-adj">{props.tagText?props.tagText:ele.profession}</span>
                        </Link>
                    </React.Fragment>
                    }
                </div>
        )
}


export const FollowUnfollowUser =(ele, callBackFunc)=>{
    FollowRequestAPI(ele.username, {}, callBackFunc)
}

export const ConstructUserRecord = (data) =>{
    return {
        "username": data.username,
        "name": data.name,
        "profile_pic": data.profile_pic
    }
}

export function UserCube(props){
    let ele = props.data;
    return(
            <div className="cube-user-attr">
                <Link className="link" key={ele.username} to={{pathname: `/profile/${ele.username}`}}>
                    {ele.profile_pic?
                        <img className="cube-user-img " src={ele.profile_pic} alt={ele.username}/>
                        :
                        <FaUserCircle className="cube-user-img default-user-logo" />
                    }
                </Link>
                <span className="m-display-name">
                    <Link to={{pathname: `/profile/${ele.username}`}} className="link">{ele.name}</Link>
                    {props.showRemoveBtn? 
                        <div className="unfollow-div">
                            <button className="btn m-fuser" onClick={() => {
                                FollowUnfollowUser(ele, props.stopFollowing)
                                UpdateRecentFriends("unfollow", ConstructUserRecord(ele)) 
                                }
                                }> Remove </button>
                        </div>
                    :   
                        <React.Fragment>
                            <span className="m-adj username">@{ele.username}</span>
                            <span className="m-adj">{ele.designation}</span>
                        </React.Fragment> 
                    }
                </span>
            </div>
    )

}

export function FollowUserCube(props){
    const ele = props.data;
    const is_following = ele.is_following? true: false
    return(
        <div className="user-cube-div">
            <div className="cube-grid">
                <UserCube data={ele} showRemoveBtn={is_following? true: false} stopFollowing={props.stopFollowing}/>
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
                    <button className="btn m-fuser" onClick={() => {
                    FollowUnfollowUser(ele, props.startFollowing)
                    UpdateRecentFriends("follow", ConstructUserRecord(ele))
                    }
                    }><FaPlus className="add-btn"/> Follow</button>}
                    
                </div>
                
            </div>
        </div>
    )
}


export function FollowUserCubeAlt(props){
    const ele = props.data;
    const is_following = ele.is_following? true: false

    return(
        <div className="user-cube-div">
            <div className="cube-grid">
                <UserCube data={ele} showRemoveBtn={false}/>
                <div className="cube-user-prof">
                    {is_following?
                    <button className="btn m-fuser dark-btn" onClick={() => {
                        FollowUnfollowUser(ele, props.stopFollowing)
                        UpdateRecentFriends("unfollow", ConstructUserRecord(ele))
                    }}> Unfollow</button>
                    :
                    <button className="btn m-fuser" onClick={() => {
                        FollowUnfollowUser(ele, props.startFollowing)
                        UpdateRecentFriends("follow", ConstructUserRecord(ele))
                        }}>< FaPlus /> Follow</button>}
                    
                </div>
                
            </div>
        </div>

    )
}
export default {UserFlat, UserCube,  FollowUserCube, FollowUserCubeAlt} 
