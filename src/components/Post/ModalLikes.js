import React from 'react';
import '../../assets/css/shotmodalview.css';
import {ControlledEventFire} from '../../utility/Utility'

import { FaHeart, FaRegEye, FaRegHeart, FaRegComment, FaRegPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";
import LikedBy from './LikedBy';

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
                {props.hideCommentBtn?
                ""
                :
                <button className="btn-anc" onClick={props.feedCommentBox? props.feedCommentBox: feedCommentBox}>
                    <FaRegComment className="icons" /></button>
                }
                
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
                {props.responsecounts.likes > 0 ?
                    <span className="m-l" 
                    onClick={()=>{props.displaySideView(
                        {
                            content: <LikedBy phase={"post"} post_id={props.post_id}/>,
                            sureVal: true,
                            altHeadText: <div className="s-head-text">
                                <FaHeart className="icons-active" />{props.responsecounts.likes}
                                </div>
                        }
                    )}}>
                        <FaHeart className="icons-active" />{props.responsecounts.likes}
                    </span>
                    :
                    ""
                }
                {props.responsecounts.views > 0?
                    <span className="m-l"><FaRegEye className="icons-active" />{props.responsecounts.views}</span>
                    :
                    ""
                }
                
                
            </div>
        </React.Fragment>
    )
}

const feedCommentBox = () => {
    ControlledEventFire(document.getElementById("m-add-cmnt"), 'click')
}

export default ModalLikes;