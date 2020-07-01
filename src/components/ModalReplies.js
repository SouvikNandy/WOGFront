import React from 'react';
import CommentsBase from './CommentsBase';
import CommentCubes from './CommentCubes';
import AddComment from './AddComment';
import { FaAngleLeft } from "react-icons/fa";
import { animateScroll } from "react-scroll";

export class ModalReplies extends CommentsBase {

    state = {
        data: [],
        // count: 0
    }
    componentDidMount() {
        this.addReplyFromStack();

    }

    addReplyFromStack = () => {
        this.setState({ data: [...this.state.data, ...this.props.reply_stack] })
        // this.setState({ count: this.setState.count + 1 })

    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
          containerId: "m-reply-content",
          delay: 1,
          duration:2,
        });
    }

    addComment = (comment, parent) => {
        var new_comment = this.constructComment(comment, parent);
        var updatedDataLen = this.state.data.length + 1;
        this.setState({ data: [...this.state.data, new_comment] });
        this.props.updateRepliesCount(updatedDataLen);

    }

    componentWillUnmount() {
        // store replies on comment model at unmount
        this.props.parentModal.addOnlyReplies(this.props.parentComment.id, this.state.data);
    }

    render() {
        let parrentCmnt = <CommentCubes
            key={this.props.parentComment.id} isReply={false}
            comment={this.props.parentComment}
            doLike={this.props.parentModal.doLike} doUnLike={this.props.parentModal.doUnLike}
            parentModal={null} />

        let allreplies = '';
        allreplies = this.state.data.map((item) => (
            <CommentCubes key={item.id} isReply={true} comment={item}
                doLike={this.doLike} doUnLike={this.doUnLike}
                parent_id={this.props.parentComment.id} showIfReplies={true} />
        ))
        let replyContainerClassName = "";
        if (this.props.parentModal.state.showAll) {
            replyContainerClassName = "m-reply-content m-reply-content-fh"
        }
        else {
            replyContainerClassName = "m-reply-content"
        }
        return (
            <React.Fragment>
                <div className="m-reply-div">
                    <div className={replyContainerClassName} id="m-reply-content">
                        <div className="m-comment-head">
                            <div className="m-hide-reply-btn">
                                
                                <button className="btn-anc" onClick={this.props.showReplyList.bind(this)}>
                                    <FaAngleLeft className="icons-active" /></button>
                            </div>
                            <div className="m-show-parent-cmnt">{parrentCmnt}</div>
                        </div>
                        <div className="m-reply-list">{allreplies}</div>
                    </div>
                    <div className="m-post-comment z-5" id="replyCommentBox">
                        <AddComment addComment={this.addComment} />
                    </div>

                </div>

            </React.Fragment>
        )
    }
}

export default ModalReplies;