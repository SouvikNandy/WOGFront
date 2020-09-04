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
import OwlLoader from '../components/OwlLoader';
import HTTPRequestHandler from '../utility/HTTPRequests';
import {saveInStorage, retrieveFromStorage, ControlledEventFire, msToDateTime} from '../utility/Utility';
import AddPost from '../components/Post/AddPost';
import { createFloatingNotification } from '../components/FloatingNotifications';
import { UserFeedsAPI, SavePostAPI, LikePostAPI } from '../utility/ApiSet';
import Paginator from '../utility/Paginator';
import { JSONToEditState, EditorSpan } from '../components/TextInput';

export class NewsFeeds extends Component {
    render() {
        let userData = getUserData();
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"feeds"} username={userData.username}/>
                <NewsFeedUserMenu />
                <div className="nf-container">
                    <div className="nf-feeds">
                        <NewFeedPalette currLocation={this.props.location}/>
                    </div>
                    <NewsFeedSuggestions />
                    <AddPost />
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
        ImgCompressor(e, this.makeUploadRequest, imgKey)
    }

    makeUploadRequest=(compressedFile, imgKey)=>{
        let url = 'api/v1/user-profile/?r='+window.innerWidth;
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
        let noti_key = "Profile picture updated"
        let noti_msg = "Here comes your new profile picture. Cheers!"
        createFloatingNotification('success', noti_key, noti_msg)
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
        feeds:null,
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
    }
    componentDidMount(){
        UserFeedsAPI(this.updateStateOnAPIcall.bind(this, 'feeds'))
        let eventListnerRef = this.handleScroll.bind(this);
        this.setState({
            eventListnerRef: eventListnerRef
        })
        window.addEventListener('scroll', eventListnerRef);
    }
    
    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        
    }
    updateStateOnAPIcall = (key, data)=>{
        if('count' in data && 'next' in data && 'previous' in data){
            let result = data.results
            result.map(ele=> {
                if(ele.description){
                    ele["description"] = JSONToEditState(JSON.parse(ele.description))
                }
                return ele
            })
            // paginated response
            this.setState({
                [key]: result,
                paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
            })
        }
        else{
            this.setState({
                [key]: data.data
            })
        }
    }
    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            feeds:[...this.state.feeds, ...results],
            isFetching: false
        })
    }


    savePost = (idx) =>{
        let feed_id = null
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.id === idx){
                    if(!ele.is_saved){
                        ele.is_saved = true;
                    }
                    else{
                        ele.is_saved = !ele.is_saved;
                        
                    }
                    feed_id= ele.id;
                }
                return ele
            })
        })
        if(feed_id){
            let requestBody = {post_id: feed_id}
            SavePostAPI(requestBody, null)

        }
        
    }

    likePortfolio = (idx) =>{
        let feed_id = null
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = true;
                    ele.interactions.likes++;
                    feed_id= ele.id;
                }
                return ele
            })
        })
        if(feed_id){
            let requestBody = {post_id: feed_id}
            LikePostAPI(requestBody, null)

        }

    }
    unLikePortfolio = (idx) =>{
        let feed_id=null
        this.setState({
            feeds: this.state.feeds.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = false;
                    ele.interactions.likes--;
                    feed_id= ele.id;
                }
                return ele
            })
        })
        if(feed_id){
            let requestBody = {post_id: feed_id}
            LikePostAPI(requestBody, null)

        }
    }
    render(){
        let feedList = [];
        if(!this.state.feeds){
            return(
                <div className="empty-feeds" key={'def'}>
                    <OwlLoader />
                </div>
            )

        }
        if (this.state.feeds.length<1){
            feedList.push(
                <div className="empty-feeds" key={'def'}>
                    <NoContent message={"Start following people to view their post on your feeds."}/>
                </div>
            )

        }
        else{
            this.state.feeds.map(ele=>{
                feedList.push(<NewsFeedPost key={ele.id} data={ele} currLocation={this.props.currLocation}
                    likePortfolio={this.likePortfolio} unLikePortfolio={this.unLikePortfolio}
                    savePost={this.savePost} addComment={this.addComment}/>)
                
                return ele
    
            })
        }
        if(this.state.isFetching){
            feedList.push(<div className="empty-feeds" key={'def'}><OwlLoader /> </div>)
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
        ControlledEventFire(document.getElementById(eleID), 'click')
    }

    render(){
        let pf = this.props.data;
        let tagText = pf.location
        return(
            <div  className="nf-post-conatiner">
                <div className="nfp-user-preview">
                    {tagText?<UserFlat data={pf.user} tagText={tagText} />: <UserFlat data={pf.user}/>}
                    
                </div>
                <div className="nfp-portfolio-preview" >
                    <Portfolio key={pf.id} data={pf} currLocation={this.props.currLocation} onlyShots={true} />
                </div>
                <div className="nfp-likes-mod">
                    <ModalLikes
                        doLike={this.props.likePortfolio.bind(this, pf.id)}
                        doUnLike={this.props.unLikePortfolio.bind(this, pf.id)}
                        isLiked={pf.is_liked}
                        isSaved={pf.is_saved}
                        savePost={this.props.savePost.bind(this, pf.id)}
                        feedCommentBox={this.feedCommentBox.bind(this, "npf-"+ pf.id )}
                        responsecounts={pf.interactions} />
                </div>
                <div className="nfp-details">
                    <div className="m-display-name" onClick={this.feedCommentBox.bind(this, "npf-"+ pf.id )}>{pf.portfolio_name}</div>
                    <div className="m-dt" onClick={this.feedCommentBox.bind(this, "npf-"+ pf.id )}>{msToDateTime(pf.created_at)}</div>
                    <div className="m-description">{EditorSpan(pf.description)}</div>
                    <div className="cmnt-count" onClick={this.feedCommentBox.bind(this, "npf-"+ pf.id )}>
                        {pf.interactions.comments>0? <span>view all {pf.interactions.comments} comments</span>: <span>Be the first to comment</span> }
                    
                    </div>

                </div>
            </div>
        )
    }
}

export default NewsFeeds
