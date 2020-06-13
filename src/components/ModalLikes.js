import React, { Component } from 'react';
import '../assets/css/shotmodalview.css';

import { FaHeart, FaPaperPlane, FaRegHeart, FaRegComment, FaRegPaperPlane } from "react-icons/fa";

const ModalLikes = (props) => {
    let likeBtn = props.isLiked ?
        <FaHeart className="icons icons-active" onClick={props.doUnLike} /> :
        <FaRegHeart className="icons" onClick={props.doLike} />
    return (
        <React.Fragment>
            <div className="m-likes-action">
                <button className="btn-anc">{likeBtn}</button>
                <button className="btn-anc"><FaRegComment className="icons" /></button>
                <button className="btn-anc"><FaRegPaperPlane className="icons" /></button>
            </div>
            <div className="m-likes-preview">
                <FaHeart className="icons" /><span>{props.responsecounts.likes}</span>
                <FaPaperPlane className="icons" /><span>{props.responsecounts.shares}</span>
            </div>
        </React.Fragment>
    )
}


export default ModalLikes;