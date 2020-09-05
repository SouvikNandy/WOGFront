import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import {generateId, getCurrentTimeInMS} from '../../utility/Utility.js';

// Images for shot
import w1 from "../../assets/images/wedding1.jpg";

class CommentsBase extends Component {
    state = {
        data: [],
    }

    doLike = (item) => {
        // api call to like comment
        // also increase the count
        // console.log("do like called", item);
        this.setState({
            data: this.state.data.map(comment => {
                if (comment.id === item.id) {
                    comment.is_liked = true;
                    comment.likes++;
                }
                return comment
            })
        })

    }
    doUnLike = (item) => {
        // api call to update likes
        // also decrease the count
        this.setState({
            data: this.state.data.map(comment => {
                if (comment.id === item.id) {
                    comment.is_liked = false;
                    comment.likes--;
                }
                return comment
            })
        })
    }

    constructComment = (comment, parent) => {
        parent = parent ? parent : null;
        var new_comment = {
            "id": generateId(),
            "name": "user3",
            "profileimg": w1,
            "created_at": getCurrentTimeInMS(),
            "comment": comment,
            "is_liked": false,
            "likes": 0,
            "reply_stack": [],
            "parent": parent,

        }
        return new_comment;
    }

    addComment = (comment, parent) => {
        let newcomment = this.constructComment(comment, parent);
        // console.log("new comment base ", newcomment);
        if (newcomment.parent !== null) {
            // console.log("inside parent !=null ", newcomment.parent, this.state.data);
            this.setState({
                data: this.state.data.map(item => {
                    if (item.id === newcomment.parent) {
                        // console.log(item.id, "matched");
                        item.reply_count++;
                        item.reply_stack.push(newcomment);
                    }
                    return item;
                })
            });
        }
        else {
            this.setState({ data: [...this.state.data, newcomment] });
        }

    }

    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}


export default CommentsBase;
