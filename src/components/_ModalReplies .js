import React, { Component } from 'react';
import { FaHeart } from "react-icons/fa";
// Images for shot
import w1 from "../assets/images/wedding1.jpg";

export class ModalReplies extends Component {
    state = {
        "replies": [
            {
                "id": 1,
                "name": "user1",
                "profileimg": w1,
                "created_at": 1589028744,
                "comment": "Nice Picture",
                "is_liked": false,
                "likes": 0
            },
            {
                "id": 2,
                "name": "user1",
                "profileimg": w1,
                "created_at": 1589028744,
                "comment": "Nice Picture",
                "is_liked": false,
                "likes": 0
            }
        ]
    }
    componentDidMount() {
        console.log(this.props.comment_id);
    }

    doLike = (id) => {
        // api call to like comment
        // also increase the count
        console.log("dolike", id);
        this.setState({
            replies: this.state.replies.map(comment => {
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
            replies: this.state.replies.map(comment => {
                if (comment.id === id) {
                    comment.is_liked = false;
                    comment.likes--;
                }
                return comment
            })
        })
    }

    render() {
        let allreplies = '';
        if (this.state.replies.length > 0) {
            allreplies = this.state.replies.map((item) => (
                <Reply key={item.id} comment={item} doLike={this.doLike} doUnLike={this.doUnLike} />
            ))

        }
        return (
            <React.Fragment>
                {allreplies}
            </React.Fragment>
        )
    }
}


export class Reply extends Component {
    render() {
        const cmnt = this.props.comment;
        // let isLiked = cmnt.is_liked ? 'icons-active' : 'icons';
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
                            </div>
                        </div>

                    </div>
                </section>
            </React.Fragment>

        )
    }
}

export default ModalReplies;