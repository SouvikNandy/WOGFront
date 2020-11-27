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
import {Redirect} from 'react-router-dom';
import getUserData from '../../utility/userData';
import SocketInterface from '../../utility/SocketInterface';
import { isAuthenticated } from '../../utility/Utility';


export class ModalComments extends CommentsBase {
    socket = null
    state = {
        showAll: false,
        commentLimit: 10,
        data: null,
        count: 0,
        rootCommentBox: null,
        paginator: null,
        isFetching: false,
        redirectLogin: false,
        sockRoom: '',
        sockUser: '',
        
    }

    componentDidMount(){
        if(!this.props.comments_enable){
            this.setState({data: []})
            
        }
        else{
            GetCommentsAPI(this.props.post_id, this.updateStateOnAPIcall)
        }
    }

    componentWillUnmount() {
        // leave sock room
        if(this.socket) this.socket.leaveRoom(getUserData().username) 
    }

    redirectToLogin = () =>{
        this.setState({redirectLogin: !this.state.redirectLogin})
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
        let sockRoom = null
        let sockUser = null
        if(isAuthenticated()){
            sockRoom= 'P-'+this.props.post_id
            sockUser= getUserData().username
            this.socket = new SocketInterface('commentbox')
            this.socket.joinRoom(sockUser, sockRoom,  (error) => {
                if(error) {
                    console.log("unable to join room on ns: commentbox")
                    }
                })
            this.socket.receiveMessage(message => {
                let newrecv = message.text
                // console.log("new received", newrecv)
                newrecv["comment"] = JSONToEditState(JSON.parse(newrecv.comment))
                this.setState({ data: [newrecv, ...this.state.data], count: this.state.count + 1 }, ()=>{
                    this.scrollToBottom("m-comments-view");
                })
            });
            this.socket.roomUser(()=>{});
        }
        // paginated response
        try{
            this.setState({
                data: result,
                paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null,
                count: data.count, 
                sockRoom: sockRoom,
                sockUser: sockUser
            })

        }
        catch(err){
            // console.log("ERROR=====>", err)
            this.setState({
                data: [],
                paginator: null,
                count: 0, 
                sockRoom: sockRoom,
                sockUser: sockUser
            })

        }
        
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
        // console.log("new comment to add", newcomment)
        this.socket.sendMessage(this.jsonifyComment(newcomment), () => {});
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
        if(!this.props.isAuth) return;
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
        if(this.state.redirectLogin){
            return(<Redirect to={{
                  pathname: `/m-auth/`,
                  state: { modal: true, currLocation: this.props.currLocation }
              }} />
          )}

        let allComments = <span className="m-no-comments"><NoContent message={"No comments yet"}/></span>
        if(!this.props.comments_enable){
            allComments = <span className="m-no-comments"><NoContent message={"Comments are turned off"}/></span>
            return(
                <React.Fragment>
                    <section className="m-show-all-coments"><span className="count-txt">Comments are turned off</span></section>
                    <section className="m-comments-view" id="m-comments-view">
                        {allComments}
                    </section>

                </React.Fragment>
            )
        }
        if (this.state.data.length > 0) {
            if (this.state.showAll) {
                allComments = this.state.data
            }
            else {
                allComments = this.state.data.slice(Math.max(this.state.data.length - this.state.commentLimit, 0))
            }
            // console.log("all comments", allComments);
            allComments = allComments.sort(this.sortByCreationTime).map((item) => (
                <CommentCubes key={item.id}
                    isReply={false} comment={item} doLike={this.doLike} doUnLike={this.doUnLike}
                    parent_id={null} parentModal={this} showIfReplies={true} post_id={this.props.post_id} 
                    displaySideView={this.props.displaySideView}
                    isAuth={this.props.isAuth}
                    currLocation={this.props.currLocation}
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
                            {this.props.isAuth?
                            <span className="prev-link" onClick={this.viewPreviousComments}>View Previous Comments</span>
                            :
                            <span className="prev-link" onClick={this.redirectToLogin}>Sign In to View Previous Comments</span>
                            }
                            
                        </div>
                        :
                        ""
                    }
                    {allComments}
                </section>
                <section className="m-post-comment" id="mainCommentBox">
                    <AddComment addComment={this.addComment} isAuth={this.props.isAuth} currLocation={this.props.currLocation}/>
                </section>

            </React.Fragment>
        )
    }
}


export default ModalComments;