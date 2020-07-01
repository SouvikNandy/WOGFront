import React, { Component } from 'react';

import '../assets/css/shotmodalview.css';
import { FaHeart } from "react-icons/fa";
import ModalReplies from "./ModalReplies";

export class CommentCubes extends Component {
    state = {
        showReplies: false,
        repliesCount: 0
    }

    showReplyList = () => {
        this.setState({ showReplies: !this.state.showReplies })
    }

    updateRepliesCount = (count) => {
        // console.log("update Replies count called with ", count)
        this.setState({ repliesCount: count })
    }

    getParent = () => {
        if (this.props.isReply) {
            return this.props.parent_id;
        }
        else {
            return this.props.comment.id;
        }
    }

    feedCommentBox = () => {
        document.getElementById("setparent").value = this.getParent();
        document.getElementById("m-add-cmnt").select();
        // document.getElementById("m-add-cmnt").value = this.getParent();

    }

    render() {

        const cmnt = this.props.comment;
        const isReply = this.props.isReply;
        let viewReplies = '';
        let viewReplyBtnMsg = '';
        let showhideReplyList = '';

        let totalRepliesCount = Math.max(cmnt.reply_stack.length, this.state.repliesCount);

        if (!isReply && this.props.showIfReplies) {

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
                        parentModal={this.props.parentModal} />
                </div>;

            }
            else {
                viewReplyBtnMsg = <span>View Replies({totalRepliesCount})</span>;
                showhideReplyList = ''
            }

            if (cmnt.reply_stack.length > 0) {
                viewReplies = <button className="btn-anc" onClick={this.showReplyList}>{viewReplyBtnMsg}</button>
            }

        }


        return (
            <React.Fragment>
                <section className="m-commented">
                    <img className="m-user-img" src={cmnt.profileimg} alt="" />
                    <div className="m-user-cmt">
                        <div className="m-cmnt-content">
                            <div className="m-cmt-description">
                                <span className="m-display-name">{cmnt.name}</span>
                                <span className="m-cmt-adj">{cmnt.comment}</span>
                            </div>
                            <span className="m-cmt-reaction">
                                {cmnt.is_liked ?
                                    <button className="btn-anc" onClick={this.props.doUnLike.bind(this, cmnt)}><FaHeart className='icons-active' /></button> :
                                    <button className="btn-anc" onClick={this.props.doLike.bind(this, cmnt)}><FaHeart className='icons' /></button>
                                }
                            </span>
                        </div>
                        <div className="m-cmnt-replies">
                            <div className="m-reply-head">
                                <span>1hr ago</span>
                                <span><button className="btn-anc">{cmnt.likes} Likes</button></span>
                                <span><button className="btn-anc" onClick={this.feedCommentBox}>Reply</button></span>
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