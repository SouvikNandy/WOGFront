import React, {useState} from 'react';
import '../../assets/css/shotmodalview.css';
import {ControlledEventFire} from '../../utility/Utility';

import { FaHeart, FaRegEye, FaRegHeart, FaRegComment } from "react-icons/fa";
// import { FiSend} from "react-icons/fi";
import {BsBookmarkPlus, BsBookmarkFill} from "react-icons/bs";
import {AiFillCopy} from "react-icons/ai";
import {RiShareFill} from "react-icons/ri";
import {IoInfiniteSharp} from "react-icons/io5";
import LikedBy from './LikedBy';
import { Redirect } from 'react-router-dom';
import { createFloatingNotification } from '../FloatingNotifications';
import { Link } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';

const ModalLikes = (props) => {
    const [redirectAction, redirectToSignin] = useState(false)
    const [shareOptions, showShareOptions] = useState(false)

    if(redirectAction){
        return(<Redirect to={{
            pathname: `/m-auth/`,
            state: { modal: true, currLocation: props.currLocation }
        }} />)
    }
    return (
        <React.Fragment>
            <div className="m-likes-action">
                <button className="btn-anc">
                    {props.isLiked ?
                    <FaHeart className="icons icons-active" onClick={props.doUnLike} /> 
                    :
                    <FaRegHeart className="icons" onClick={props.isAuth? props.doLike: ()=> redirectToSignin(!redirectAction)} />
                    }
                </button>
                {props.hideCommentBtn?
                ""
                :
                <button className="btn-anc" onClick={props.feedCommentBox? props.feedCommentBox: feedCommentBox}>
                    <FaRegComment className="icons" /></button>
                }
                <span className="share-options">
                    <button className="btn-anc" onClick={()=>showShareOptions(!shareOptions)}><IoInfiniteSharp className="icons" /></button>
                    {shareOptions?
                        <div className="share-opt">
                            <div className="s-opt" onClick={()=>CopyStringToClipboard(props.copyLink())}><AiFillCopy className="s-icons"/><span>Copy Link</span></div>
                            <Link className="link s-opt" onClick={()=>showShareOptions(!shareOptions)}
                            to={{
                                pathname: `/share-shot/${props.copyLink(true)}`,
                                // This is the trick! This link sets
                                // the `background` in location state.
                                state: { modal: true, currLocation: props.currLocation }
                            }}
                            
                            ><RiShareFill className="s-icons"/><span>Share</span></Link>
                            <div className="link s-opt"><FiSend className="s-icons"/>Send To</div>
                        </div>
                        :
                        ""
                    }     
                </span>
                
                <button className="btn-anc">
                {props.isSaved ?
                    <BsBookmarkFill className="icons icons-active" onClick={props.savePost} /> 
                    :
                    <BsBookmarkPlus className="icons" onClick={props.isAuth? props.savePost: ()=> redirectToSignin(!redirectAction)} />
                }
                </button>
            </div>
            <div className="m-likes-preview">
                {props.responsecounts.likes > 0 ?
                    <span className="m-l" 
                    onClick={!props.displaySideView?()=>{} :()=>{props.displaySideView(
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
function CopyStringToClipboard (strVal) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = strVal;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

    createFloatingNotification("success", "", "Link Copied")
 }
 
const feedCommentBox = () => {
    ControlledEventFire(document.getElementById("m-add-cmnt"), 'click')
}

export default ModalLikes;