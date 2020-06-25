import React, { Component } from 'react';
import '../assets/css/shotmodalview.css';
import { FaHeart } from "react-icons/fa";
import ModalReplies from "./ModalReplies";

// Images for shot
import w1 from "../assets/images/wedding1.jpg";

export class ModalComments extends Component {
    state = {
        "comments": [
            {
                "id": 1,
                "name": "user1",
                "profileimg": w1,
                "created_at": 1589028744,
                "comment": "Nice Picture",
                "is_liked": false,
                "likes": 20,
                "reply_count": 2

            },
            {
                "id": 2,
                "name": "user2",
                "profileimg": w1,
                "created_at": 1589028744,
                "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisi elit, mattis id facilisis nec, imperdiet eu lorem. Phasellus elit velit, finibus ut quam vitae, auctor egestas lectus. Nunc convallis interdum risus at semper. Pellentesque auctor sollicitudin felis et tincidunt. Sed faucibus vestibulum elit vel hendrerit. Nam eu eros accumsan, fermentum felis at, accumsan libero. Nulla rhoncus, ante ac sagittis aliquam, nibh magna dictum eros, vitae pulvinar nisi urna nec augue. Mauris gravida egestas mauris eget convallis. Aenean pretium pretium odio. Integer malesuada et velit eu euismod. Nam nisl nisl, feugiat quis nisl at, lobortis convallis quam.",
                "is_liked": false,
                "likes": 20,
                "reply_count": 0
            },
            {
                "id": 3,
                "name": "user3",
                "profileimg": w1,
                "created_at": 1589028744,
                "comment": "Nice Picture",
                "is_liked": false,
                "likes": 20,
                "reply_count": 0

            }
        ]
    }
    // componentDidMount() {
    //     console.log("mounted", this.props.post_id);
    // }

    doLike = (id) => {
        // api call to like comment
        // also increase the count
        this.setState({
            comments: this.state.comments.map(comment => {
                if (comment.id === id) {
                    comment.is_liked = true;
                    comment.likes++;
                }
                return comment
            })
        })
    }
    doUnLike = (id) => {
        // api call to update likes
        // also decrease the count

        this.setState({
            comments: this.state.comments.map(comment => {
                if (comment.id === id) {
                    comment.is_liked = false;
                    comment.likes--;
                }
                return comment
            })
        })
    }

    render() {

        let allComments = "No comments yet";
        if (this.state.comments.length > 0) {
            allComments = this.state.comments.slice(0, 2).map((item) => (
                <Comment key={item.id} comment={item} doLike={this.doLike} doUnLike={this.doUnLike} />
            ))
        };

        let totalComments = this.state.comments.length > 2 ?
            <button className="btn-anc">Show all {this.state.comments.length} comments</button> :
            this.state.comments.length > 0 ?
                <span>{this.state.comments.length} comments</span> :
                <span>No comments</span>

        return (
            <React.Fragment>
                <section className="m-show-all-coments">{totalComments}</section>
                <section className="m-comments-view">
                    {allComments}
                </section>
                <section className="m-post-comment">
                    <form className="m-comment-form">
                        <textarea className="m-add-cmnt" placeholder="Add a comment" required ></textarea>
                        <input type="submit" className="m-cmnt-submit" value="Post" />
                    </form>

                </section>

            </React.Fragment>
        )
    }
}


class Comment extends Component {
    state = {
        showReplies: false
    }

    showReplyList = () => {
        this.setState({ showReplies: !this.state.showReplies })
    }

    render() {
        const cmnt = this.props.comment;
        let viewReplies = '';
        let viewReplyBtnMsg = '';
        let showhideReplyList = '';

        if (this.state.showReplies) {
            viewReplyBtnMsg = <span>Hide Replies</span>;
            showhideReplyList = <ModalReplies comment_id={2} />

        }
        else {
            viewReplyBtnMsg = <span>View Replies({cmnt.reply_count})</span>;
            showhideReplyList = ''
        }

        if (cmnt.reply_count > 0) {
            viewReplies = <button className="btn-anc" onClick={this.showReplyList}>{viewReplyBtnMsg}</button>
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
                                    <button className="btn-anc" onClick={this.props.doUnLike.bind(this, cmnt.id)}><FaHeart className='icons-active' /></button> :
                                    <button className="btn-anc" onClick={this.props.doLike.bind(this, cmnt.id)}><FaHeart className='icons' /></button>
                                }
                            </span>
                        </div>
                        <div className="m-cmnt-replies">
                            <div className="m-reply-head">
                                <span>1hr ago</span>
                                <span><button className="btn-anc">{cmnt.likes} Likes</button></span>
                                <span><button className="btn-anc">Reply</button></span>
                                <span>{viewReplies}</span>
                            </div>
                            <div className="m-replied-section">
                                {/* <ModalReplies comment_id={2} /> */}
                                {showhideReplyList}
                            </div>
                        </div>

                    </div>
                </section>
            </React.Fragment>
        )
    }
}



export default ModalComments;