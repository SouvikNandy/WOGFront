import React, { Component } from 'react';
import '../assets/css/newsfeeds.css';
import {TiEdit} from "react-icons/ti";
import { FaCameraRetro } from 'react-icons/fa';
import {BsClockHistory, BsBookmarks} from 'react-icons/bs';
import {AiOutlineUsergroupAdd, AiOutlineStar, AiOutlinePoweroff} from 'react-icons/ai';
import {FiUnlock, FiSettings} from 'react-icons/fi';
import { UserFlat } from '../components/UserView';
import Portfolio from '../components/Portfolio';
import ModalLikes from '../components/ModalLikes';


import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";

export class NewsFeeds extends Component {
    render() {
        return (
            
            <div className="nf-container">
                <NewsFeedUserMenu />
                
                <div className="nf-feeds">
                    <NewFeedPalette currLocation={this.props.location}/>
                </div>
                <div className="nf-rest">
                    <div className="nf-suggestions">
                        
                    </div>
                    <div className="nf-sponsers"></div>
                    <div className="nf-explore-more"></div>
                </div>
                
            </div>
        )
    }
}

export function NewsFeedUserMenu(){
    return(
        <div className="nf-user-menu">
            <div className="nf-user-menu-overlay"></div>
            <div className="nf-user-edit">
                <div className="nf-user-img">
                    <img className="cube-user-img " src={w1} alt=""/>
                    <span className="edit-pic">
                        <FaCameraRetro  className="cam-icon"/>
                    </span>
                </div>
                        
                <span className="m-display-name">
                    Full Name
                    <span className="m-adj">@username</span>
                    <span className="m-adj">designation</span>
                </span>
                <button className="btn edit-btn"><TiEdit  className="ico" />Edit Profile</button>

            </div>
            <div className="nf-user-menulist">
                <div className="nf-upper-tokens">
                    <div className="nf-menu-tokens">
                        <BsClockHistory className="ico" />
                        <span>Your Activities</span>
                    </div>
                    <div className="nf-menu-tokens">
                        <AiOutlineUsergroupAdd className="ico" />
                        <span>Discover People</span>
                    </div>
                    <div className="nf-menu-tokens">
                        <AiOutlineStar className="ico" />
                        <span>Ratings & Reviews</span>
                    </div>
                    <div className="nf-menu-tokens">
                        <BsBookmarks className="ico" />
                        <span>Saved</span>
                    </div>

                </div>
                <div className="nf-lower-tokens">
                    <div className="nf-menu-tokens">
                        <FiUnlock className="ico" />
                        <span>Privacy</span>
                    </div>
                    <div className="nf-menu-tokens">
                        <FiSettings className="ico" />
                        <span>Settings</span>
                    </div>
                    <div className="nf-menu-tokens">
                        <AiOutlinePoweroff className="ico" />
                        <span>Log Out</span>
                    </div>

                </div>
            </div>
        </div>

    )
}

export class NewFeedPalette extends Component{
    state= {
        feeds:[
            {
                user:{"id": 1, "name":"John Doe", "username": "johndoe", "profile_pic": w1, "designation": "photographer"},
                portfolio: {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1], likes: 100, comments: 100, shares:0},
                
            },
            {
                user:{"id": 1, "name":"John Doe", "username": "johndoe", "profile_pic": w1, "designation": "photographer"},
                portfolio: {id: 2, name:"p1", shot: [w1], likes: 100, comments: 100, shares:0}, 
            },
        ]
    }

    savePost = (idx) =>{
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.portfolio.id === idx){
                    if(!ele.portfolio.isSaved){
                        console.log("if cond")
                        ele.portfolio.isSaved = true;
                    }
                    else{
                        ele.portfolio.isSaved = !ele.portfolio.isSaved;
                    }
                }
                return ele
            })
        })
    }

    likePortfolio = (idx) =>{
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.portfolio.id === idx){
                    ele.portfolio.is_liked = true;
                    ele.portfolio.likes++;
                }
                return ele
            })
        })

    }
    unLikePortfolio = (idx) =>{
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.portfolio.id === idx){
                    ele.portfolio.is_liked = false;
                    ele.portfolio.likes--;
                }
                return ele
            })
        })

    }
    addComment = (idx) =>{
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.portfolio.id === idx){
                    
                    ele.portfolio.comments++;
                }
                return ele
            })
        })

        

    }
    render(){
        let feedList = [];
        this.state.feeds.map(ele=>{
            feedList.push(<NewsFeedPost key={ele.portfolio.id} data={ele} currLocation={this.props.location}
                likePortfolio={this.likePortfolio} unLikePortfolio={this.unLikePortfolio}
                savePost={this.savePost} addComment={this.addComment}/>)
            
            return ele

        })
        return(
            <React.Fragment>
                {feedList}
            </React.Fragment>
        )
    }
}


export class NewsFeedPost extends Component{

    feedCommentBox = (eleID) => {
        document.getElementById(eleID).select();
    }
    addComment = (eleID) =>{
        let divID = "short-comment-"+ eleID;
        let ele = document.getElementById(divID);
        console.log(ele.value);
        document.getElementById(divID).value = "";
        this.props.addComment(eleID);
    }
    
    render(){
        let user = this.props.data.user;
        let pf = this.props.data.portfolio;
        let responsecounts ={
            likes: pf.likes, comments: pf.comments, shares: pf.shares
        }

        return(
            <div  className="nf-post-conatiner">
                <div className="nfp-user-preview">
                    <UserFlat data={user}/>
                </div>
                <div className="nfp-portfolio-preview" >
                    <Portfolio key={pf.id} data={pf} currLocation={this.props.location} onlyShots={true} />
                </div>
                <div className="nfp-likes-mod">
                    <ModalLikes
                        doLike={this.props.likePortfolio.bind(this, pf.id)}
                        doUnLike={this.props.unLikePortfolio.bind(this, pf.id)}
                        isLiked={pf.is_liked}
                        isSaved={pf.isSaved}
                        savePost={this.props.savePost.bind(this, pf.id)}
                        feedCommentBox={this.feedCommentBox.bind(this, "short-comment-"+ pf.id )}
                        responsecounts={responsecounts} />
                </div>
                <div className="nfp-details">
                    <span className="m-display-name">
                        {pf.name}
                        <span className="m-adj"> Lorem Ipsum dollar amet ... see more</span>
                    </span>
                    <div className="cmnt-count"> view all {pf.comments} comments</div>

                </div>
                <div className="nfp-comments">
                    <textarea className="short-comment" placeholder="Add a comment..." id={"short-comment-"+ pf.id}></textarea>
                    <button className="btn" onClick={this.addComment.bind(this, pf.id)}>Post</button>
                </div>

            </div>
        )
    }
}

export default NewsFeeds
