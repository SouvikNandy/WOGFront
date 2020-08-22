import React, { Component } from 'react';
import '../assets/css/newsfeeds.css';
import {TiEdit} from "react-icons/ti";
import { FaCameraRetro, FaUserCircle } from 'react-icons/fa';
import {BsClockHistory, BsBookmarks} from 'react-icons/bs';
import {AiOutlineUsergroupAdd, AiOutlineStar, AiOutlinePoweroff} from 'react-icons/ai';
import {FiSettings} from 'react-icons/fi';
import { UserFlat } from '../components/Profile/UserView';
import Portfolio from '../components/Profile/Portfolio';
import ModalLikes from '../components/Post/ModalLikes';
import {UserNavBar} from "../components/Navbar/Navbar";
import {Link} from 'react-router-dom';
import ImgCompressor from '../utility/ImgCompressor';
import SideBar from "../components/SideBar";
import Settings from '../components/Settings/Settings';
import getUserData from '../utility/userData';
import EditProfile from '../components/Profile/EditProfile';

import NoContent from '../components/NoContent';
import HTTPRequestHandler from '../utility/HTTPRequests';
import {saveInStorage, retrieveFromStorage} from '../utility/Utility';
import AddPost from '../components/Post/AddPost';

export class NewsFeeds extends Component {
    render() {
        let userData = getUserData();
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"feeds"} username={userData.username}/>
                <div className="nf-container">
                    <NewsFeedUserMenu />
                    
                    <div className="nf-feeds">
                        <NewFeedPalette currLocation={this.props.location}/>
                        <div className="add-pst-btn">
                            <AddPost />
                        </div>
                    </div>
                    <NewsFeedSuggestions />
                    
                </div>
            </React.Fragment>
        )
    }
}

export class NewsFeedUserMenu extends Component{
    state ={
        // userdata 
        userData : JSON.parse(retrieveFromStorage('user_data')),

        // sidebar states
        showSideView: false,
        sideBarHead: false,
        searchBarRequired: false,
        sideViewContent: [],
        altHeadText : null,
        editProf: false,
    }

    editProfile = () =>{
        this.setState({editProf: !this.state.editProf})
    }

    uploadPicture =(e, imgKey) =>{
        console.log(e.target.files, imgKey)
        ImgCompressor(e, this.makeUploadRequest, imgKey)
    }

    makeUploadRequest=(compressedFile, imgKey)=>{
        let url = 'api/v1/user-profile/'
        let formData = new FormData();
        formData.append(imgKey, compressedFile); 
        HTTPRequestHandler.put(
            {url:url, requestBody: formData, includeToken:true, uploadType: 'file', callBackFunc: this.addFileToState.bind(this, compressedFile, imgKey), errNotifierTitle:"Update failed !"})

    }

    addFileToState = (compressedFile, imgKey, data) =>{
        this.onSuccessfulUpdate(data);
        let updatedUserData = this.state.userData
        if (imgKey === "profile_pic"){
            updatedUserData.profile_data.profile_pic = data.data.profile_data.profile_pic
            // this.setState({profile_pic: URL.createObjectURL(compressedFile)})
            this.setState({userData: updatedUserData})
        }
    }

    onSuccessfulUpdate = (data) =>{
        // console.log(data.data)
        saveInStorage("user_data",JSON.stringify(data.data));
    }
    displaySideView = ({content, sureVal, sideBarHead=true}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            sideBarHead: sideBarHead,            
        })

        if(content){
            this.setState({
                sideViewContent: content
            })
        }
        
    }
    render(){
        let userData = this.state.userData;
        let username = userData.username;
        return(
            <React.Fragment>
                {this.state.editProf?
                <div className="nf-edit-profile">
                    <EditProfile closeModal={this.editProfile}/>
                </div>
                
                :
                ""
                }
                <div className="nf-user-menu">
                    <div className="nf-user-menu-overlay"></div>
                    <div className="nf-user-edit">
                        <div className="nf-user-img">
                            {userData.profile_data && userData.profile_data.profile_pic?
                            <img className="cube-user-img" src={userData.profile_data.profile_pic} alt=""/>
                            :
                            <FaUserCircle className="cube-user-img default-user-logo" />
                            }
                            
                            <span className="edit-pic">
                                <input type="file" className="pic-uploader" onChange={ e => this.uploadPicture(e, 'profile_pic')}/>
                                <FaCameraRetro  className="cam-icon"/>
                            </span>
                        </div>
                                
                        <span className="m-display-name">
                            {userData.name}
                            <span className="m-adj">@{userData.username}</span>
                            <span className="m-adj">
                                {(userData.profile_data && userData.profile_data.profession)?
                                userData.profile_data.profession:""}</span>
                        </span>
                        <button className="btn edit-btn" onClick={this.editProfile}><TiEdit  className="ico" />Edit Profile</button>

                    </div>
                    <div className="nf-user-menulist">
                        <div className="nf-upper-tokens">
                            <div className="nf-menu-tokens">
                                <BsClockHistory className="ico" />
                                <span>Your Activities</span>
                            </div>
                            <Link className="link nf-menu-tokens" to={`/discover-people/${username}`} >
                                <AiOutlineUsergroupAdd className="ico" />
                                <span>Discover People</span>
                            </Link>
                            <Link className="link nf-menu-tokens" to={`/user-profile/${username}?active=Reviews`}>
                                <AiOutlineStar className="ico" />
                                <span>Ratings & Reviews</span>
                            </Link>
                            <Link className="link nf-menu-tokens" to={`/user-profile/${username}?active=Saved`}>
                                <BsBookmarks className="ico" />
                                <span>Saved</span>
                            </Link>

                        </div>
                        <div className="nf-lower-tokens">
                            {/* <div className="nf-menu-tokens">
                                <FiUnlock className="ico" />
                                <span>Privacy</span>
                            </div> */}
                            <div className="nf-menu-tokens"
                            onClick={this.displaySideView.bind(this, 
                            {content:<Settings displaySideView={this.displaySideView}/>, 
                            sureVal: true,
                            sideBarHead: false
                            })}>
                                <FiSettings className="ico" />
                                <span>Settings</span>
                            </div>
                            <Link className="nf-menu-tokens" to={`/log-out/`}>
                                <AiOutlinePoweroff className="ico" />
                                <span>Log Out</span>
                                
                            </Link>

                        </div>
                    </div>
            </div>
            {this.state.showSideView?
                <div className="form-side-bar-view side-bar-view-active">
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent} 
                    searchPlaceHolder={this.state.searchPlaceHolder} sideBarHead={this.state.sideBarHead}
                    searchBarRequired={this.state.searchBarRequired} altHeadText={this.state.altHeadText}/>
                </div>
                :
                <div className="form-side-bar-view"></div>
                }

            </React.Fragment>
            

        )
    }
}


export function NewsFeedSuggestions (){
    return(
        <div className="nf-rest">
            <div className="nf-suggestions">
                
            </div>
            <div className="nf-sponsers"></div>
            <div className="nf-explore-more"></div>
        </div>

    )
}

export class NewFeedPalette extends Component{
    state= {
        feeds:[
            // {
            //     user:{"id": 1, "name":"John Doe", "username": "johndoe", "profile_pic": w1, "designation": "photographer"},
            //     portfolio: {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1], likes: 100, comments: 100, shares:0},
                
            // },
            // {
            //     user:{"id": 1, "name":"John Doe", "username": "johndoe", "profile_pic": w1, "designation": "photographer"},
            //     portfolio: {id: 2, name:"p1", shot: [w1], likes: 100, comments: 100, shares:0}, 
            // },
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
        if (this.state.feeds.length<1){
            feedList.push(
                <div className="empty-feeds" key={'def'}>
                    <NoContent message={"Start following people to view their post on your feeds."}/>
                </div>
            )

        }
        else{
            this.state.feeds.map(ele=>{
                feedList.push(<NewsFeedPost key={ele.portfolio.id} data={ele} currLocation={this.props.location}
                    likePortfolio={this.likePortfolio} unLikePortfolio={this.unLikePortfolio}
                    savePost={this.savePost} addComment={this.addComment}/>)
                
                return ele
    
            })

        }
        
        
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
