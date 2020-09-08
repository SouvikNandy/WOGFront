import React from 'react';
import CommentsBase from './CommentsBase';
import CommentCubes from './CommentCubes';
import AddComment from './AddComment';
import '../../assets/css/shotmodalview.css';

// import { animateScroll } from "react-scroll";
import NoContent from '../NoContent';
import {GetCommentsAPI} from '../../utility/ApiSet';
import {JSONToEditState} from '../TextInput';
import Paginator from '../../utility/Paginator';
import OwlLoader from '../OwlLoader';


export class ModalComments extends CommentsBase {
    state = {
        showAll: false,
        commentLimit: 10,
        data: null,
        count: 0,
        rootCommentBox: null,
        paginator: null,
        isFetching: false
    }

    componentDidMount(){
        GetCommentsAPI(this.props.post_id, this.updateStateOnAPIcall)
    }

    updateStateOnAPIcall = (data)=>{
        let result = data.results
        result.map(ele=> {
            if(ele.comment){
                ele["comment"] = JSONToEditState(JSON.parse(ele.comment))
                ele.reply_stack = []
                ele.replyPaginator = null
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

    addOnlyReplies = (commnetId, dataSet, replyPaginator) => {
        this.state.data.map(item => {
            if (item.id === commnetId) {
                item.reply_stack = dataSet;
                item.replyPaginator = replyPaginator
            }
            return item;
        })

    }
    addComment = (comment) => {
        let newcomment = this.constructComment(comment, null);
        // data will be rendered in reverse format
        this.setState({ data: [newcomment, ...this.state.data], count: this.state.count + 1 }, ()=>{
            this.scrollToBottom("m-comments-view");
        });
        
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
                ele.reply_stack = []
                ele.replyPaginator = null
            }
            return ele
        })
        this.setState({
            data:[ ...this.state.data, ...result],
            isFetching: false
        })
    }

    render() {
        if(!this.state.data) return(<span className="m-no-comments"><OwlLoader /></span>)

        let allComments = <span className="m-no-comments"><NoContent message={"No comments yet"}/></span>
        if (this.state.data.length > 0) {
            if (this.state.showAll) {
                allComments = this.state.data
            }
            else {
                allComments = this.state.data.slice(Math.max(this.state.data.length - this.state.commentLimit, 0))
            }

            allComments = allComments.sort(this.sortByCreationTime).map((item) => (
                <CommentCubes key={item.id}
                    isReply={false} comment={item} doLike={this.doLike} doUnLike={this.doUnLike}
                    parent_id={null} parentModal={this} showIfReplies={true} post_id={this.props.post_id} 
                    displaySideView={this.props.displaySideView}
                    />
            ))
        };

        let totalComments = this.state.data.length > this.state.commentLimit ?
            <button className="btn-anc" onClick={this.ShowAllComments}>Show all {this.state.count} comments</button> :
            this.state.count > 0 ?
                <span className="count-txt">{this.state.count} comments</span> :
                <span className="count-txt">No comments</span>

        return (
            <React.Fragment>
                <section className="m-show-all-coments">{totalComments}</section>
                <section className="m-comments-view" id="m-comments-view">
                    {this.state.paginator && this.state.paginator.next?
                        <div className="prev-content">
                            <span className="prev-link" onClick={this.viewPreviousComments}>View Previous Comments</span>
                        </div>
                        :
                        ""
                    }
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