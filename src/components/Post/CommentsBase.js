import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import {generateId, getCurrentTimeInMS} from '../../utility/Utility.js';
import { animateScroll } from "react-scroll";


import { AddCommentAPI, LikeCommentAPI } from '../../utility/ApiSet';
import { ExtractToJSON } from '../TextInput';
import getUserData from '../../utility/userData';

class CommentsBase extends Component {
    state = {
        data: [],
    }

    LikeDislikeAPI = (postId, commentId) =>{
        let requestBody ={
            post_id: postId,
            comment_id: commentId
        }
        LikeCommentAPI(requestBody, null)
    }

    doLike = (postId, item) => {
        // api call to like comment
        // also increase the count
        // console.log("do like called", item);
        let selected = null
        this.setState({
            data: this.state.data.map(comment => {
                if (comment.id === item.id) {
                    comment.is_liked = true;
                    comment.likes++;
                    selected = comment.id
                }
                return comment
            })
        })
        if (selected){
            this.LikeDislikeAPI(postId, selected)
        }
    }
    doUnLike = (postId, item) => {
        // api call to update likes
        // also decrease the count
        let selected = null
        this.setState({
            data: this.state.data.map(comment => {
                if (comment.id === item.id) {
                    comment.is_liked = false;
                    comment.likes--;
                    selected = comment.id
                }
                return comment
            })
        })
        if (selected){
            this.LikeDislikeAPI(postId, selected)
        }
    }

    backendCall = (newComment) =>{
        let requestBody ={
            post_id: this.props.post_id,
            id: newComment.id,
            comment: JSON.stringify(ExtractToJSON(newComment.comment)),
            parent: newComment.parent

        }
        AddCommentAPI(requestBody, null)
    }

    constructComment = (comment, parent=null) => {
        let user = getUserData()
        var new_comment = {
            "id": generateId(),
            "user":{
                "name": user.name,
                "username": user.username,
                "profile_pic": (user.profile_data && user.profile_data.profile_pic)? user.profile_data.profile_pic: null,
            },
            "created_at": getCurrentTimeInMS(),
            "comment": comment,
            "is_liked": false,
            "likes": 0,
            "reply_stack": [],
            "parent": parent,
            "reply_count": 0

        }
        this.backendCall(new_comment)
        return new_comment;
    }

    sortByCreationTime = (a, b) =>{
        let comparison = 0;
        if(a.created_at >= b.created_at){
            comparison = 1
        }
        else{
            comparison = -1
        }
        return comparison
    }

    scrollToBottom( containerId) {
        animateScroll.scrollToBottom({
          containerId: containerId,
          delay: 1,
          duration:2,
        });
    }

    
    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}


export default CommentsBase;
