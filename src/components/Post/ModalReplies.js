import React from 'react';
import CommentsBase from './CommentsBase';
import CommentCubes from './CommentCubes';
import AddComment from './AddComment';
import { FaAngleLeft } from "react-icons/fa";
import { GetRepliesAPI } from '../../utility/ApiSet';
import Paginator from '../../utility/Paginator';
import {JSONToEditState} from '../TextInput';

export class ModalReplies extends CommentsBase {

    state = {
        data: [],
        replyToUser: null,
        paginator: null,
        isFetching: false
    }

    componentDidMount() {
        console.log("componentDidMount", this.props)
        if(this.props.reply_stack.length> 0){
            this.setState({ 
                data: this.props.reply_stack,
                paginator: this.props.paginator
            })
        }
        else{
            GetRepliesAPI(this.props.post_id, this.props.parentComment.id, this.updateStateOnAPIcall)
        }

    }

    updateStateOnAPIcall = (data)=>{
        let result = data.results
        result.map(ele=> {
            if(ele.comment){
                ele["comment"] = JSONToEditState(JSON.parse(ele.comment))
            }
            return ele
        })
        // paginated response
        this.setState({
            data: result,
            paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null,
            count: data.count
        })

    }
    
    updateStateReplyUser =(editorState) =>{
        this.setState({replyToUser: editorState})
    }

    addComment = (comment) => {
        var new_comment = this.constructComment(comment, this.props.parentComment.id);
        var updatedDataLen = this.state.data.length + 1;
        // will be rendered in reverse order
        this.setState({ data: [new_comment, ...this.state.data] }, ()=>{
                this.scrollToBottom("m-reply-content");
        });
        this.props.updateRepliesCount(updatedDataLen);
        

    }

    viewPreviousComments = () => {
        if(this.state.isFetching) return;
        if(this.state.paginator){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        let result = results
        result.map(ele=> {
            if(ele.comment){
                ele["comment"] = JSONToEditState(JSON.parse(ele.comment))
            }
            return ele
        })
        this.setState({
            data:[ ...this.state.data, ...result],
            isFetching: false
        })
    }

    componentWillUnmount() {
        // store replies on comment model at unmount
        this.props.parentModal.addOnlyReplies(this.props.parentComment.id, this.state.data, this.state.paginator);
    }

    render() {
        let parrentCmnt = <CommentCubes
            key={this.props.parentComment.id} isReply={false}
            comment={this.props.parentComment}
            doLike={this.props.parentModal.doLike} doUnLike={this.props.parentModal.doUnLike}
            parentModal={null} displaySideView={this.props.displaySideView}/>

        let allreplies = '';
        allreplies = this.state.data.sort(this.sortByCreationTime).map((item) => (
            <CommentCubes key={item.id} isReply={true} comment={item}
                doLike={this.doLike} doUnLike={this.doUnLike}
                parent_id={this.props.parentComment.id} showIfReplies={true} 
                updateStateReplyUser={this.updateStateReplyUser}
                displaySideView={this.props.displaySideView}
                />
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
                        {this.state.paginator && this.state.paginator.next?
                            <div className="prev-content">
                                <span className="prev-link" onClick={this.viewPreviousComments}>View Previous Comments</span>
                            </div>
                            :
                            ""
                        }
                        <div className="m-reply-list">{allreplies}</div>
                    </div>
                    <div className="m-post-comment z-5" id="replyCommentBox">
                        <AddComment addComment={this.addComment} 
                        replyTo={this.state.replyToUser? this.state.replyToUser: this.props.replyTo} />
                    </div>

                </div>

            </React.Fragment>
        )
    }
}

export default ModalReplies;