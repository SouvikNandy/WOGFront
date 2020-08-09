import React from 'react';
import '../../assets/css/shotmodalview.css';

import { FaHeart, FaPaperPlane, FaRegHeart, FaRegComment, FaRegPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";

const ModalLikes = (props) => {
    return (
        <React.Fragment>
            <div className="m-likes-action">
                <button className="btn-anc">
                    {props.isLiked ?
                    <FaHeart className="icons icons-active" onClick={props.doUnLike} /> 
                    :
                    <FaRegHeart className="icons" onClick={props.doLike} />
                    }
                </button>
                <button className="btn-anc" onClick={props.feedCommentBox? props.feedCommentBox: feedCommentBox}>
                    <FaRegComment className="icons" /></button>
                <button className="btn-anc"><FaRegPaperPlane className="icons" /></button>
                <button className="btn-anc">
                {props.isSaved ?
                    <FaBookmark className="icons icons-active" onClick={props.savePost} /> 
                    :
                    <FaRegBookmark className="icons" onClick={props.savePost} />
                }
                </button>
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