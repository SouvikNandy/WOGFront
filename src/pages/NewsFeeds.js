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
import {saveInStorage, ControlledEventFire, msToDateTime, getFrontendHost, getCurrentTimeInMS} from '../utility/Utility';
import AddPost from '../components/Post/AddPost';
import { createFloatingNotification } from '../components/FloatingNotifications';
import { UserFeedsAPI, SavePostAPI, LikePostAPI } from '../utility/ApiSet';
import Paginator from '../utility/Paginator';
import { JSONToEditState, EditorSpan } from '../components/TextInput';
import { ExplorePreview } from './Explore';
import { DiscoverUserFlat } from './DiscoverPeople';
import { RecentFriends } from '../components/Profile/RecentFriends';
import { RiUserHeartLine } from 'react-icons/ri';
import GetUploadTrackerList, { RegisterForProgressUpdates } from '../utility/UploadProgress';
import UploadProgressBar from '../components/UploadProgressBar';
import {Context} from '../GlobalStorage/Store'

export class NewsFeeds extends Component {
    state = {
        uploadTrackers : GetUploadTrackerList()
    }
    componentDidMount(){
        RegisterForProgressUpdates('NF', this.ProgressBarUpdates)
    }

    toggleAddPostModal = ()=>{

        this.setState({uploadTrackers: GetUploadTrackerList()})
    }
    ProgressBarUpdates = (id, val) =>{
        let updatedTrackers = this.state.uploadTrackers.map(ele => {
            if(ele.id === id){
                ele.value = val
            }
            return ele
        })

        this.setState({uploadTrackers: updatedTrackers})

    }

    render() {
        let userData = getUserData();
        let currently_uploadloading = this.state.uploadTrackers.filter(ele => ele.isUploading)
        // console.log("currently_uploadloading", currently_uploadloading)
        let uploadBars = currently_uploadloading.map(ele=>{
            return (<UploadProgressBar now={ele.value} />)
        })
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"feeds"} username={userData.username}/>
                <NewsFeedUserMenu />
                <div className="nf-container">
                    <div className="nf-feeds">
                        <NewFeedPalette currLocation={this.props.location}/>
                    </div>
                    {window.innerWidth >900? <NewsFeedSuggestions  username={userData.username}/>: ""}
                    
                    <AddPost toggleAddPostModal={this.toggleAddPostModal}/>
                </div>
                {uploadBars}
            </React.Fragment>
        )
    }
}

export class NewsFeedUserMenu extends Component{
    static contextType = Context
    state ={
        // userdata 
        // userData : JSON.parse(retrieveFromStorage('user_data')),

        // sidebar states
        showSideView: false,
        sideBarHead: false,
        searchBarRequired: false,
        sideViewContent: [],
        altHeadText : null,
        editProf: false,
    }

    componentDidMount(){
        if (!this.context[0].user_data){ 
            this.context[1]({type: 'SET_USER', payload: getUserData()});
        }
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
        let updatedUserData = this.context[0].user_data
        if (imgKey === "profile_pic"){
            updatedUserData.profile_data.profile_pic = data.data.profile_data.profile_pic
            // this.setState({profile_pic: URL.createObjectURL(compressedFile)})
            // this.setState({userData: updatedUserData})
            this.context[1]({type: 'SET_USER', payload: getUserData()});
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
        let userData = this.context[0].user_data;
        if(!userData) return(<React.Fragment></React.Fragment>)
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
                            <Link className="link nf-menu-tokens" to={`/all-friends/`} >
                                <RiUserHeartLine className="ico" />
                                <span>Following & Followers</span>
                            </Link>
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


export function NewsFeedSuggestions (props){
    // console.log("NewsFeedSuggestions mounted")
    return(
        <div className="nf-rest">
            <div className="nf-fixed">
                <div className="nf-cont">
                    <div className="nf-suggestions">
                        <div className="s-label">
                            <h4>Explore</h4>
                            <span className="s-tag">#trending</span>
                        </div>
                        
                        <ExplorePreview counter={2}/>
                    </div>
                    {props.discoverSuggestion=== false?
                        ""
                        :
                        <div className="nf-discover">
                            <div className="s-label">
                                <h4>Discover</h4>
                                <span className="s-tag">People around you</span>
                            </div>
                            <DiscoverUserFlat counter={2}/>
                            <div className="see-more">
                                <Link className="link" to={`/discover-people/${props.username}`}>See more</Link>
                            </div>
                            
                        </div>
                    }
                    
                    <div className="nf-active">
                        <div className="s-label">
                            <h4>Say Hi</h4>
                            <span className="s-tag">Send hi, start a conversation</span>
                        </div>
                        <RecentFriends />
                    </div>

                </div>
                

            </div>
            
        </div>

    )
}

export class NewFeedPalette extends Component{
    static contextType = Context
    
    state= {
        feeds:null,
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
    }
    componentDidMount(){
        if(!this.context[0].feeds_updated || getCurrentTimeInMS() - this.context[0].feeds_updated  < 300 ){
            UserFeedsAPI(this.updateStateOnAPIcall.bind(this, 'feeds'))
            let eventListnerRef = this.handleScroll.bind(this);
            this.setState({
                eventListnerRef: eventListnerRef
            })
            window.addEventListener('scroll', eventListnerRef);
        }
        
    }
    
    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        
    }
    updateStateOnAPIcall = (key, data)=>{
        let result = data.results
        result.map(ele=> {
            if(ele.description){
                ele["description"] = JSONToEditState(JSON.parse(ele.description))
            }
            return ele
        })
        let feeds = result;
        let paginator= data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        this.context[1]({type: 'SET_POSTS', payload: {feeds: feeds, paginator: paginator, feeds_updated: getCurrentTimeInMS()}});
    }

    getPaginator =()=>{
        return this.context[0].feeds_paginator
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.getPaginator()){
            let res = this.getPaginator().getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        let newResult = results
            newResult.map(ele=> {
                if(ele.description){
                    ele["description"] = JSONToEditState(JSON.parse(ele.description))
                }
                return ele
            })
        
        this.context[1]({type: 'ADD_POST', payload: newResult})
        this.setState({
            isFetching: false
        })
    }


    savePost = (idx) =>{
        let feed_id = null
        let updatedFeeds = this.context[0].feeds
        let paginator = this.getPaginator()
        
        updatedFeeds.map(ele =>{
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

        if(feed_id){
            this.context[1]({type: 'SET_POSTS', payload: {feeds: updatedFeeds, paginator: paginator, feeds_updated: this.context[0].feeds_updated}});
            let requestBody = {post_id: feed_id}
            SavePostAPI(requestBody, null)

        }
        
    }

    likePortfolio = (idx) =>{
        let feed_id = null
        let updatedFeeds = this.context[0].feeds
        let paginator = this.getPaginator()


        updatedFeeds.map(ele =>{
            if(ele.id === idx){
                ele.is_liked = true;
                ele.interactions.likes++;
                feed_id= ele.id;
            }
            return ele
        })
        if(feed_id){
            this.context[1]({type: 'SET_POSTS', payload: {feeds: updatedFeeds, paginator: paginator, feeds_updated: this.context[0].feeds_updated}});
            let requestBody = {post_id: feed_id}
            LikePostAPI(requestBody, null)

        }

    }
    unLikePortfolio = (idx) =>{
        let feed_id=null
        let updatedFeeds = this.context[0].feeds
        let paginator = this.getPaginator()

        updatedFeeds.map(ele =>{
            if(ele.id === idx){
                ele.is_liked = false;
                ele.interactions.likes--;
                feed_id= ele.id;
            }
            return ele
        })
        if(feed_id){
            this.context[1]({type: 'SET_POSTS', payload: {feeds: updatedFeeds, paginator: paginator, feeds_updated: this.context[0].feeds_updated}});
            let requestBody = {post_id: feed_id}
            LikePostAPI(requestBody, null)

        }
    }
    render(){
        let feedList = [];
        if(!this.context[0].feeds){
            return(
                <div className="empty-feeds" key={'def'}>
                    <OwlLoader />
                </div>
            )
        }
        if (this.context[0].feeds.length<1){
            feedList.push(
                <div className="empty-feeds" key={'def'}>
                    <NoContent message={"Start following people to view their post on your feeds."}/>
                </div>
            )

        }
        else{
            this.context[0].feeds.map(ele=>{
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
    
    getPortFolioLink = (onlyKey=false) =>{
        let data = this.props.data;
        if (onlyKey){
            return data.user.username +'-'+ data.id +'-'+ data.attachments[0].id
        }
        else{
            return getFrontendHost()+'/shot-view/'+ data.user.username +'-'+ data.id +'-'+ data.attachments[0].id
        }
        
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
                        isAuth={true}
                        savePost={this.props.savePost.bind(this, pf.id)}
                        feedCommentBox={this.feedCommentBox.bind(this, "npf-"+ pf.id )}
                        responsecounts={pf.interactions}
                        currLocation={this.props.currLocation}
                        copyLink={this.getPortFolioLink}
                        />
                </div>
                <div className="nfp-details">
                    <div className="m-display-name" onClick={this.feedCommentBox.bind(this, "npf-"+ pf.id )}>{pf.portfolio_name}</div>
                    <div className="m-dt" onClick={this.feedCommentBox.bind(this, "npf-"+ pf.id )}>{msToDateTime(pf.created_at)}</div>
                    <div className="m-description">{EditorSpan(pf.description)}</div>
                    <div className="cmnt-count" onClick={this.feedCommentBox.bind(this, "npf-"+ pf.id )}>
                        {!pf.interactions.comments_enable?
                            ""
                            :
                            pf.interactions.comments>0? 
                            <span>view all {pf.interactions.comments} comments</span>
                            :
                            <span>Be the first to comment</span> }
                    
                    </div>

                </div>
            </div>
        )
    }
}

export default NewsFeeds
