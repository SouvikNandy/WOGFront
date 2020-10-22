import React from 'react';

import '../../assets/css/ChatModule/infoBar.css';
import "../../assets/css/userview.css";
import { FiArrowLeftCircle } from 'react-icons/fi';
import { AiFillCloseCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { defaultProfilePic } from '../../utility/userData';

const InfoBar = ({ user , closeChat, moveToOpenChats}) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            {moveToOpenChats?
            <FiArrowLeftCircle className="icons" onClick={moveToOpenChats}/>
            :
            ""
            }
            
            <AiOutlineCloseCircle className="icons" onClick={closeChat}/>
        </div>
        <div className="rightInnerContainer">
            <div className="link m-display-name" >
                <div className="head-name">
                    <span className="main-title">{user.username}</span> 
                </div>
                <span className="m-adj">{user.name}</span>
            </div>
            <div className="user-img">
                <img className="tag-img" alt="" src={user.profile_pic? user.profile_pic: defaultProfilePic()} />
            </div>
        </div>
  </div>
);


export const InfoImage = ({user, reOpenChat, removeFromOpenChat}) =>{
    return (
        <div className="user-img" >
            {user.is_unread?
                <div className="close-chathead unread-icon"></div>
            :
                <AiFillCloseCircle className="close-chathead" onClick={removeFromOpenChat}/>
            }
            
            <img className="tag-img" alt="" src={user.profile_pic? user.profile_pic: defaultProfilePic()} onClick={reOpenChat}/>
        </div>
    )
}

export default InfoBar;