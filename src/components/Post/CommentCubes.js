import React, { Component } from 'react';

import '../../assets/css/shotmodalview.css';
import { FaHeart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import ModalReplies from "./ModalReplies";
import { EditorSpan, JSONToEditState } from '../TextInput';
import { timeDifference } from '../../utility/Utility';
import LikedBy from './LikedBy';

export class CommentCubes extends Component {
    state = {
        showReplies: false,
        repliesCount: 0,
        replyTo: null
    }

    componentDidMount(){
        this.setState({repliesCount: this.props.comment.reply_count})
    }

    showReplyList = () => {
        this.setState({ showReplies: !this.state.showReplies })
    }

    updateRepliesCount = (count) => {
        // console.log("update Replies count called with ", count)
        this.setState({ repliesCount: this.state.repliesCount + 1 })
    }

    getParent = () => {
        if (this.props.isReply) {
            return this.props.parent_id;
        }
        else {
            return this.props.comment.id;
        }
    }

    feedCommentBox = (replyTo = null) => {
        // console.log("inside feedCommentBox", replyTo)
        // construct draft js editor readable object
        if(replyTo){
            replyTo = this.editorReadableState(replyTo)
        }
        if (this.props.updateStateReplyUser){
            this.props.updateStateReplyUser(replyTo)
        }
        else{
            this.setState({ showReplies: !this.state.showReplies, replyTo: replyTo})
        }
        
    }

    editorReadableState = (user) =>{
        // refrerence
        let block = {
            "blocks":[
                {"key":"amqul", "text":"@user1", "type":"unstyled", "depth":0, "inlineStyleRanges":[],
                "entityRanges":[{"offset":0,"length":6,"key":0}],"data":{}}
            ],
            "entityMap":{
                "0":{"type":"mention","mutability":"SEGMENTED",
                "data":{
                    "mention":{
                        "name":"user1","title":"Matthew Russell",
                        "link":"https://twitter.com/mrussell247",
                        "avatar":"https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg",
                        "userId":13}
                    }
                }
            }
        }
        block["blocks"][0]["key"] = Math.random().toString(36).substring(8)
        block["blocks"][0]["text"]= "@"+ user.username
        block["blocks"][0]["entityRanges"][0]["length"] = block["blocks"][0]["text"].length
        block["entityMap"][0]["data"]["mention"] = {
            "name": user.username, "title": user.name, "link": "/profile/"+user.username+'/', "avatar": user.profile_pic
        }

        return JSONToEditState(block)

    }

    render() {

        const cmnt = this.props.comment;
        const isReply = this.props.isReply;
        let viewReplies = '';
        let viewReplyBtnMsg = '';
        let showhideReplyList = '';
        
        if (!isReply && this.props.showIfReplies) {
            let totalRepliesCount = Math.max(cmnt.reply_stack.length , this.state.repliesCount);
            if (this.state.showReplies) {
                viewReplyBtnMsg = <span>Hide Replies</span>;
                let replyContainerClassName = '';
                if (this.props.parentModal.state.showAll) {
                    replyContainerClassName = "m-reply-modal m-reply-modal-fh"
                }
                else {
                    replyContainerClassName = "m-reply-modal"
                }
                showhideReplyList = <div className={replyContainerClassName}>
                    <ModalReplies
                        parentComment={cmnt}
                        showReplyList={this.showReplyList}
                        updateRepliesCount={this.updateRepliesCount}
                        reply_stack={cmnt.reply_stack}
                        paginator={cmnt.replyPaginator}
                        parentModal={this.props.parentModal}
                        post_id={this.props.post_id}
                        replyTo ={this.state.replyTo}
                        displaySideView={this.props.displaySideView}
                        isAuth={this.props.isAuth} 
                        currLocation={this.props.currLocation}
                        />
                </div>;

            }
            else {
                viewReplyBtnMsg = <span>View Replies({totalRepliesCount})</span>;
                showhideReplyList = ''
            }

            if (totalRepliesCount > 0) {
                
                // viewReplies = <button className="btn-anc" onClick={this.showReplyList}>{viewReplyBtnMsg}</button>
                viewReplies = <button className="btn-anc" onClick={this.feedCommentBox.bind(this, cmnt.user)}>{viewReplyBtnMsg}</button>
            }

        }


        return (
            <React.Fragment>
                <section className="m-commented">
                    {cmnt.user.profile_pic?
                    <img className="m-user-img" src={cmnt.user.profile_pic} alt="" />
                    :
                    <FaUserCircle className="m-user-img default-user-logo" />
                    }
                    
                    <div className="m-user-cmt">
                        <div className="m-cmnt-content">
                            <div className="m-cmt-description">
                                <span className="m-display-name">{cmnt.user.username}</span>
                                <span className="m-cmt-adj">{EditorSpan(cmnt.comment)}</span>
                            </div>
                            {cmnt.likes > 0?
                                <span className="m-cmt-reaction" 
                                onClick={this.props.displaySideView.bind(
                                    this, 
                                    {content: <LikedBy phase={"comment"} post_id={this.props.post_id} comment_id={cmnt.id} />, 
                                    sureVal: true,
                                    altHeadText: <div className="s-head-text">
                                        <FaHeart className="icons-active" />{cmnt.likes}
                                    </div>
                                })}
                                >
                                    <FaHeart className='icons-active' />
                                    <span>{cmnt.likes}</span> 
                                </span>
                                :
                                ""
                            }
                            
                        </div>
                        <div className="m-cmnt-replies">
                            <div className="m-reply-head">
                                <span>{timeDifference(cmnt.created_at)}</span>
                                <span>
                                {cmnt.is_liked ?
                                    <button className="btn-anc like-btn" 
                                    onClick={this.props.doUnLike.bind(this, this.props.post_id, cmnt)}>
                                        <FaHeart className='icons-active' />
                                    </button> 
                                    :
                                    <button className="btn-anc like-btn" 
                                    onClick={this.props.doLike.bind(this, this.props.post_id, cmnt)}>
                                        <FaRegHeart className='icons' />
                                    </button>
                                }
                                </span>
                                <span><button className="btn-anc" onClick={this.feedCommentBox.bind(this, cmnt.user)}>Reply</button></span>
                                <span>{isReply ? '' : viewReplies}</span>
                            </div>
                        </div>

                    </div>
                </section>
                {isReply ? '' : showhideReplyList}

            </React.Fragment>
        )
    }
}

export default CommentCubes;