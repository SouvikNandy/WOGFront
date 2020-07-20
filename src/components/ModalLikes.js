import React from 'react';
import '../assets/css/shotmodalview.css';

import { FaHeart, FaPaperPlane, FaRegHeart, FaRegComment, FaRegPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";

const ModalLikes = (props) => {
    let likeBtn = props.isLiked ?
        <FaHeart className="icons icons-active" onClick={props.doUnLike} /> :
        <FaRegHeart className="icons" onClick={props.doLike} />
    return (
        <React.Fragment>
            <div className="m-likes-action">
                <button className="btn-anc">{likeBtn}</button>
                <button className="btn-anc" onClick={feedCommentBox}><FaRegComment className="icons" /></button>
                <button className="btn-anc"><FaRegPaperPlane className="icons" /></button>
                <button className="btn-anc"><FaRegBookmark className="icons" /></button>
            </div>
            <div className="m-likes-preview">
                <FaHeart className="icons" /><span>{props.responsecounts.likes}</span>
                <FaPaperPlane className="icons" /><span>{props.responsecounts.shares}</span>
            </div>
        </React.Fragment>
    )
}

const feedCommentBox = () => {
    document.getElementById("m-add-cmnt").select();
}

export default ModalLikes;