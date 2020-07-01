import React from 'react';
import CommentsBase from './CommentsBase';
import CommentCubes from './CommentCubes';
import AddComment from './AddComment';
import '../assets/css/shotmodalview.css';

import { animateScroll } from "react-scroll";



export class ModalComments extends CommentsBase {
    state = {
        showAll: false,
        commentLimit: 10,
        data: [],
        rootCommentBox: null
    }


    componentDidUpdate(){
        this.scrollToBottom();
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
          containerId: "m-comments-view",
          delay: 1,
          duration:2,
        });
    }

    addOnlyReplies = (commnetId, dataSet) => {
        this.state.data.map(item => {
            if (item.id === commnetId) {
                item.reply_stack = dataSet;
            }
            return item;
        })

    }

    ShowAllComments = () => {
        var target1 = document.getElementById('modal-about-img');
        var target2 = document.getElementById('m-comments-view');
        if (target1.className === "modal-about-img") {
            target1.className += " hide-about";
        }
        else {
            target1.className = "modal-about-img"
        }

        if (target2.className === "m-comments-view") {
            target2.className += " m-comments-view-fh";
        }
        else {
            target2.className = "m-comments-view"
        }
        this.setState({ showAll: !this.state.showAll });
    }

    render() {

        let allComments = <span className="m-no-comments">No comments yet</span>
        if (this.state.data.length > 0) {
            if (this.state.showAll) {
                allComments = this.state.data
            }
            else {
                allComments = this.state.data.slice(Math.max(this.state.data.length - this.state.commentLimit, 0))
            }

            allComments = allComments.map((item) => (
                <CommentCubes key={item.id}
                    isReply={false} comment={item} doLike={this.doLike} doUnLike={this.doUnLike}
                    parent_id={null} parentModal={this} showIfReplies={true} />
            ))
        };

        let totalComments = this.state.data.length > this.state.commentLimit ?
            <button className="btn-anc" onClick={this.ShowAllComments}>Show all {this.state.data.length} comments</button> :
            this.state.data.length > 0 ?
                <span className="count-txt">{this.state.data.length} comments</span> :
                <span className="count-txt">No comments</span>

        return (
            <React.Fragment>
                <section className="m-show-all-coments">{totalComments}</section>
                <section className="m-comments-view" id="m-comments-view">
                    {allComments}
                </section>
                <section className="m-post-comment" id="mainCommentBox">
                    <AddComment addComment={this.addComment} />
                </section>

            </React.Fragment>
        )
    }
}


export default ModalComments;