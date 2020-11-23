import React, { Component, useState } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane , FaCheckCircle, FaCameraRetro, FaUserCircle} from "react-icons/fa";
import { AiFillCloseCircle, AiFillSetting } from 'react-icons/ai';
import SearchHead from '../components/Search/SearchHead';
import Subnav from '../components/Navbar/Subnav';
import UserAbout from '../components/Profile/UserAbout';
import {Shot} from '../components/Post/Shot';
import Portfolio from '../components/Profile/Portfolio';
import AddPost from '../components/Post/AddPost';
import Footer from '../components/Footer';
import {FollowUserCubeAlt, FollowUnfollowUser, ConstructUserRecord} from '../components/Profile/UserView';
import DummyShots from '../components/Post/DummyShots';
import {generateId, isSelfUser, isAuthenticated} from '../utility/Utility.js';
import NoContent from '../components/NoContent';
import CommunityReview, { ReactionPalette } from '../pages/CommunityReview'
import { UserNavBar } from '../components/Navbar/Navbar';
import { TiEdit } from 'react-icons/ti';
import EditProfile from '../components/Profile/EditProfile';
import ImgCompressor from '../utility/ImgCompressor';
import {defaultCoverPic, UpdateRecentFriends} from '../utility/userData';
import { retrieveFromStorage, saveInStorage } from '../utility/Utility';
import HTTPRequestHandler from '../utility/HTTPRequests';
import { createFloatingNotification } from '../components/FloatingNotifications';
import { Redirect, Link } from 'react-router-dom';
import OwlLoader from '../components/OwlLoader';
import Paginator from '../utility/Paginator';
import { AddUserReviewsAPI, ApproveTagAPI, BlockUser, RemoveTagAPI, UpdateUserReviewsAPI } from '../utility/ApiSet';
import ReportContent from '../components/Post/ReportContent';
import { ConfirmationPopup } from '../components/Settings/SecurityOptions';
import Chatbox from '../components/ChatModule/Chatbox';



const AuthUserNav = [
    {"key": "sm-1", "title": "Shots", "count": true, "isActive":true},
    {"key": "sm-2", "title": "Portfolios", "count": true, "isActive":false},
    {"key": "sm-3", "title": "Tags", "count": true, "isActive":false},
    {"key": "sm-4", "title": "Followers", "count": true, "isActive":false},
    {"key": "sm-5", "title": "Following", "count": true, "isActive":false},
    {"key": "sm-6", "title": "Saved", "count": true, "isActive":false},
    {"key": "sm-7", "title": "About", "isActive":false},
    {"key": "sm-8", "title": "Reviews", "isActive":false},

]

const PublicNav = [
    {"key": "sm-1", "title": "Shots", "count": true, "isActive":true},
    {"key": "sm-2", "title": "Portfolios", "count": true, "isActive":false},
    {"key": "sm-3", "title": "Tags", "count": true, "isActive":false},
    {"key": "sm-4", "title": "Followers", "count": true, "isActive":false},
    {"key": "sm-5", "title": "Following", "count": true, "isActive":false},
    {"key": "sm-6", "title": "About", "isActive":false},
    {"key": "sm-7", "title": "Reviews", "isActive":false},
]

const StateSubmenuMap = {
    'Shots': 'userPortFolio', 'Portfolios': 'userPortFolio', 'Saved': 'userSaved', 'Followers': 'userFollower', 
    'Following': 'userFollowing', 'About': 'userAbout', 'TagApproved': 'tagApproved', 'TagRequests': 'tagRequests'
    }

const StatePaginatorMap = {
    'Shots': 'portfolioPaginator', 'Portfolios': 'portfolioPaginator', 'Saved': 'savedPaginator', 'Followers': 'followerPaginator', 
    'Following': 'followingPaginator', 'TagApproved': 'tagApprovedPaginator', 'TagRequests':'tagRequestPaginator'
    }

export default class Profile extends Component {
    state = {
        subNavList:[],

        tagNavOptions:[
            {key: "tn-1", "title": "Approved", "count": true, "isActive": true},
            {key: "tn-2", "title": "Requests", "count": true, "isActive": false}
        ],
        userPortFolio : null,
        userFollower: null,
        userFollowing: null,
        userSaved : null,
        tagApproved :null,
        tagRequests : null,
        userAbout: null, 
        isAuth: false,
        isSelf : null,
        editProf: false,
        // forceful rerender
        forceRerender : false,
        // paginations
        portfolioPaginator : null,
        followerPaginator: null,
        followingPaginator: null,
        tagApprovedPaginator: null,
        tagRequestPaginator: null,
        savedPaginator: null,

        eventListnerRef: null,
        isFetching: false,
    }

    componentDidMount(){
        // get user portfolio data
        let subnav = ''
        let isSelf = false
        let userAbout = ''
        let isAuth = false
        if (isAuthenticated()){
            isAuth = true
            userAbout = JSON.parse(retrieveFromStorage("user_data"))
        }
        if(isAuth && isSelfUser(userAbout.username, this.props.match.params.username)){
            subnav = AuthUserNav;
            isSelf = true;
            
        }
        else{
            subnav = PublicNav;
            userAbout = null;
            // call api to get user about
            this.retrieveDataFromAPI('About', this.updateInitialAbout, isAuth)

        }
        let qstr = new URLSearchParams(this.props.location.search);
        let activeTab = qstr.get('active');
        if(activeTab){
            subnav.map(ele=>{
                if(ele.title.toLowerCase()=== activeTab.toLowerCase()){
                    ele.isActive = true;
                    activeTab = ele.title;
                }
                else{
                    ele.isActive = false
                }
                return ele
            })
        }
        else{
            activeTab = subnav.filter(ele=>ele.isActive === true)[0].title   
        }
        // console.log("active tab", activeTab);
        this.retrieveDataFromAPI(activeTab, this.updateStateOnAPIcall, isAuth)

        // add event listner
        let eventListnerRef = this.handleScroll.bind(this);
        this.setState({
            subNavList: subnav, isAuth: isAuth, isSelf: isSelf, userAbout: userAbout, eventListnerRef: eventListnerRef
        })
        window.addEventListener('scroll', eventListnerRef);

    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;

        let currentPage = this.state.subNavList.filter(ele => ele.isActive)[0]
        let paginatorKey = this.getPaginatorFromSubmenuName(currentPage.title)
        if(!paginatorKey) return;
        if(this.state[paginatorKey]){
            let res = this.state[paginatorKey].getNextPage(this.updateStateOnPagination.bind(this, currentPage.title))
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (key , results) =>{
        let stateKey = this.getStateKeyFromSubmenuName(key)
        this.setState({
            [stateKey]:[...this.state[stateKey], ...results],
            isFetching: false
        })
    }

    updateInitialAbout = (key, menu, data)=>{
        this.setState({
            [key]: data.data,
        })
        

    }
    getStateKeyFromSubmenuName = (name) =>{
        try{
            return StateSubmenuMap[name]
        }
        catch{
            return null
        }
        
    }
    getPaginatorFromSubmenuName = (name) =>{
        try{
            return StatePaginatorMap[name]
        }
        catch{
            return null
        }
        
    }


    getAPIUrl = (key) =>{
        switch(key){
            case 'Shots':
                return 'api/v1/view-post/'+ this.props.match.params.username + '/';

            case 'Portfolios':
                return 'api/v1/view-post/'+ this.props.match.params.username + '/';

            case 'Saved':
                return 'api/v1/save-post/';
            
            case 'Following':
                return 'api/v1/follow-requests/' + this.props.match.params.username +'/?q=following';
            
            case 'Followers':
                return 'api/v1/follow-requests/' + this.props.match.params.username +'/?q=followers';
            
            case 'About':
                return 'api/v1/user-profile/?q='+ this.props.match.params.username+'&r='+ window.innerWidth;
            
            //tag cases
            case 'TagApproved':
                return  'api/v1/view-tags/'+ this.props.match.params.username + '/?q=approved';
            
            //tag cases
            case 'TagRequests':
                return  'api/v1/view-tags/'+ this.props.match.params.username + '/?q=requests';
            
            default: return null

        }

    }

    retrieveDataFromAPI = (selectedMenu, callbackFunc, isAuth=null)=>{
        if (selectedMenu === "Tags"){
            selectedMenu = 'Tag'+ this.state.tagNavOptions.filter(ele=> ele.isActive===true)[0].title
        }
        
        let url = this.getAPIUrl(selectedMenu)
        let stateKey = this.getStateKeyFromSubmenuName(selectedMenu)
        // console.log("retrieveDataFromAPI", stateKey, selectedMenu)
        // don't make calls if user is blocked
        if (this.state.userAbout && stateKey === "userAbout"){
            return true
        }
        if (this.state.userAbout && this.state.userAbout.is_blocked){
            this.setState({
                [stateKey]: null
            })
            return true

        }
        if(isAuth === null) {
            isAuth = this.state.isAuth
        }

        if (this.state[stateKey]!== null){
            // don't make api call
            return true
        }
        if(isAuth === false &&  ['Saved', 'Followers', 'Following'].includes(selectedMenu)){
            
            this.setState({
                [stateKey]: []
            })
            return true
        }


        if (url){
            HTTPRequestHandler.get(
                {url:url, includeToken: isAuth , callBackFunc: callbackFunc.bind(this, stateKey, selectedMenu), 
                errNotifierTitle:"Update failed !"})
        }
    } 

    updateStateOnAPIcall = (key, menuTitle, data)=>{
        // console.log("updateStateOnAPIcall", key, menuTitle, data)
        if('count' in data && 'next' in data && 'previous' in data){
            // paginated response
            let paginatorKey = this.getPaginatorFromSubmenuName(menuTitle)
            this.setState({
                [key]: data.results,
                [paginatorKey]: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null

            })
        }
        else{
            this.setState({
                [key]: data.data
            })
        }

    }


    getMenuCount = (key) =>{
        return 0
    }
    
    selectSubMenu = (key) =>{
        // select a submenu
        this.setState({
            subNavList: this.state.subNavList.map(item=>{
                if(key=== item.key){
                    item.isActive = true;
                    this.retrieveDataFromAPI(item.title, this.updateStateOnAPIcall)
                }
                else{
                    item.isActive = false;
                }
                return item
            })
        })
    }

    selectTagNavMenu = (key) =>{
        this.setState({
            tagNavOptions: this.state.tagNavOptions.map(item=>{
                if(key=== item.key){
                    item.isActive = true;
                    this.retrieveDataFromAPI('Tags', this.updateStateOnAPIcall)
                }
                else{
                    item.isActive = false;
                }
                return item
            })
        })
    }
    
    likeTagRequestShot = (key, idx) => {
        // api call to update likes
        // also increase the count
        this.setState({
            [key]: this.state[key].map(ele =>{
                if(ele.id === idx) {
                    ele.is_liked=true 
                }
                return ele
            })
        })
    }

    unLikeTagRequestShot = (key, idx) => {
        // api call to update likes
        // also decrease the count
        this.setState({
            [key]: this.state[key].map(ele =>{
                if(ele.id === idx) {
                    ele.is_liked=false 
                }
                return ele
            })
        })
    }
    
    likePortfolio = (idx) =>{
        let url = 'api/v1/like-post/';
        let requestBody = {post_id: idx}
        HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: null})
        this.setState({
            userPortFolio: this.state.userPortFolio.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = true;
                    ele.interactions.likes++;
                }
                return ele
            })
        })
    }

    unLikePortfolio = (idx) =>{
        let url = 'api/v1/like-post/';
        let requestBody = {post_id: idx}
        HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: null})
        this.setState({
            userPortFolio: this.state.userPortFolio.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = false;
                    ele.interactions.likes--;
                }
                return ele
            })
        })

    }

    approveTag = (idx) =>{
        //  get item
        let item = this.state.tagRequests.filter(ele=> ele.id===idx)[0];
        // update state
        this.setState({ tagRequests: this.state.tagRequests.filter(ele=> ele.id!==idx), tagApproved: [...this.state.tagApproved, item]})
        ApproveTagAPI(idx, this.state.userAbout.username, null)
       
    }
    rejectTag = (idx) =>{
        // update state
        this.setState({ tagRequests: this.state.tagRequests.filter(ele=> ele.id!== idx)})
        RemoveTagAPI(idx, this.state.userAbout.username, null)
    }

    startFollowing =(record, response) =>{
        record.is_following = true;
        if (this.state.isSelf && this.state.userFollowing){
            this.setState({
                userFollowing: [...this.state.userFollowing, record]
            })
        }
        
    }

    stopFollowing =(record, response) =>{
        // record.is_following = false;
        if(this.state.isSelf){
            this.setState({
                userFollowing: this.state.userFollowing.filter(ele => ele.username!==record.username) 
            })

            if (this.state.userFollower){
                this.setState({
                    userFollower: this.state.userFollower.map(ele => {
                        if(ele.username === record.username){
                            ele.is_following = false;
                        }
                        return ele
                    })
                })
    
            }
        }  
    }

    startStopFollowingProfile = (data) =>{
        let userAbout = this.state.userAbout
        userAbout.is_following = !userAbout.is_following
        this.setState({
            userAbout: userAbout
        })
    }

    removeFromSaved = (idx) =>{
        let url = this.getAPIUrl('Saved');
        let requestBody = {post_id: idx}
        HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: null})
        this.setState({
            userSaved : this.state.userSaved.filter(ele=> ele.id!==idx)
        })


    }

    editProfile = () =>{
        this.setState({editProf: !this.state.editProf})
    }

    padDummyShot = (resultList, len, maxlen=5) =>{
        if (len < maxlen){
            for(let i =0; i< maxlen - len ; i++){
                resultList.push(<DummyShots  key={"DS"+ i } />)
            }
        }
        return resultList
    }
    padLoaderShot = (resultList) =>{
        resultList.push(<DummyShots  key={"DS-load" } loaderShot={true} />)
        return resultList
    }

    getNoContentDiv = (msg)=>{
        return(
            <div className="no-content-render">
                <NoContent message={msg} />
            </div>
        )

    }


    getLoaderDIv =()=>{
        return(
            <div className="no-content-render">
                <OwlLoader />
            </div>
        )
    }

    uploadPicture =(e, imgKey) =>{
        ImgCompressor(e, this.makeUploadRequest, imgKey)
    }
    makeUploadRequest=(compressedFile, imgKey)=>{
        let url = 'api/v1/user-profile/?r='+window.innerWidth
        let formData = new FormData();
        formData.append(imgKey, compressedFile); 
        HTTPRequestHandler.put(
            {url:url, requestBody: formData, includeToken:true, uploadType: 'file', callBackFunc: this.addFileToState.bind(this, compressedFile, imgKey), errNotifierTitle:"Update failed !"})

    }

    addFileToState = (compressedFile, imgKey, data) =>{
        let userAbout = this.state.userAbout;
        this.onSuccessfulUpdate(data);
        let noti_key=''
        let noti_msg=''
        if (imgKey === "profile_pic"){
            
            userAbout.profile_data.profile_pic = data.data.profile_data.profile_pic
            this.setState({userAbout: userAbout})
            noti_key = "Profile picture updated"
            noti_msg = "Here comes your new profile picture. Cheers!"
        }
        else if(imgKey === "cover_pic"){
            userAbout.profile_data.cover_pic = data.data.profile_data.cover_pic
            this.setState({userAbout: userAbout})
            noti_key = "Cover picture updated"
            noti_msg = "Here come your new Cover picture. Cheers!"
        }
        createFloatingNotification('success', noti_key, noti_msg)
    }

    onSuccessfulUpdate = (data) =>{
        // console.log(data.data)
        saveInStorage("user_data",JSON.stringify(data.data));
    }

    addNewPortfolioToState = (newRecord) =>{
        this.setState({
            userPortFolio: [newRecord, ...this.state.userPortFolio]
        })
    }

    getCompomentData = () =>{
        let resultList = [];
        let resultBlock = '';
        resultBlock = this.state.subNavList.map((item, index) => {
            if (item.title === "About" && item.isActive === true){
                // USER ABOUT
                return (
                    <React.Fragment key={item.title}>
                        <UserAbout key={item.title} data={this.state.userAbout}/>
                        <Footer />
                    </React.Fragment>
                
                )
            }
            else if (this.state.userAbout && this.state.userAbout.is_blocked){
                return(
                    <React.Fragment key={"blocked-content"+ index} >
                        <div className="profile-portfolio-grid">
                            {this.getNoContentDiv("Unblock the user to view updates !!!")}
                        
                        </div>
                        <Footer />
                    </React.Fragment>
                )

            }
            else if(item.title === "Shots" && item.isActive === true){
                // SHOTS
                if (this.state.userPortFolio && this.state.userPortFolio.length === 0){
                    let msg = "No shots yet !!!"
                    resultList = this.getNoContentDiv(msg);
                    return(
                        <React.Fragment key={item.title}>
                            <div key={item.title} className="profile-portfolio-grid">
                                {resultList}
                                
                                {this.state.isSelf?
                                <AddPost onSuccessfulUpload={this.addNewPortfolioToState} />
                                :
                                ""}
                            </div>
                            <Footer />
                        </React.Fragment>
                    )
                }
                else if (this.state.userPortFolio && this.state.userPortFolio.length > 0){
                    // get all shots
                    this.state.userPortFolio.map(portfolio => {

                        portfolio.attachments.reverse().map((ele, index)=>{
                            let cidx = portfolio.attachments.length - index;
                            let price = null;
                            if (portfolio.pricing_container && portfolio.pricing_container.hasOwnProperty(cidx)){
                                price = portfolio.pricing_container[cidx];
                            }
                            let data ={
                                id: ele.id, name: portfolio.user.name, username: portfolio.user.username, content: ele.content, 
                                interactions: portfolio.interactions, portfolio_id: portfolio.id, price : price
                            }
                            resultList.push(<Shot key={data.id} id={data.id} onlyShot={true} 
                                data={data} currLocation={this.props.location} />)
                            return ele
                        })
                        return portfolio
                    })
                    resultList = this.padDummyShot(resultList, resultList.length, 5)
                    if(this.state.isFetching){
                        resultList = this.padLoaderShot(resultList)
                    }
                    return(
                        <React.Fragment key={item.title}>
                            <div key={item.title} className="profile-shots">
                                {resultList}
                                {this.state.isSelf?
                                <AddPost onSuccessfulUpload={this.addNewPortfolioToState} />
                                :
                                ""}
                            </div>
                            {!this.state.portfolioPaginator || !this.state.portfolioPaginator.next?
                            <Footer /> : ""
                            }
                        </React.Fragment>
                    )
                }
                else{
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )
                }
                
            }
            else if (item.title === "Portfolios" && item.isActive === true){
                // PORTFOLIOS
                if (this.state.userPortFolio && this.state.userPortFolio.length === 0){
                    let msg = "No portfolios have been created !!!"
                    resultList = this.getNoContentDiv(msg)
                }
                else if(this.state.userPortFolio && this.state.userPortFolio.length > 0){
                    this.state.userPortFolio.map(ele => 
                        {resultList.push(<Portfolio key={ele.id} data={ele} currLocation={this.props.location} 
                            likePortfolio={this.likePortfolio} unLikePortfolio={this.unLikePortfolio} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userPortFolio.length, 5)
                    if(this.state.isFetching){
                        resultList = this.padLoaderShot(resultList)
                    }
                }
                else {
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                }
                
                return(
                    <React.Fragment key={item.title}>
                        <div key={item.title} className="profile-portfolio-grid">
                            {resultList}
                            {this.state.isSelf?
                            <AddPost />
                            :
                            ""}
                        </div>
                        {!this.state.portfolioPaginator || !this.state.portfolioPaginator.next?
                            <Footer /> : ""
                            }
                    </React.Fragment>
                )
            }
            else if (item.title === "Tags" && item.isActive === true){
                // TAG LIST
                // get requested or approve tab
                let getSelectedTab = this.state.tagNavOptions.filter(ele => ele.isActive === true)[0]
                // getSelectedTab.toLowerCase()
                getSelectedTab = 'tag'+getSelectedTab.title;
                // console.log("selected tab ", getSelectedTab);
                

                if(!this.state[getSelectedTab]){
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                }
                if(!this.state.isAuth){
                    let msg = "You need to signIn to view this !!!"
                    resultList = this.getNoContentDiv(msg)
                }
                else if (getSelectedTab === "tagApproved"){
                    if(this.state[getSelectedTab] && this.state[getSelectedTab].length === 0){
                        let msg = "No tags made it upto here !!!"
                        resultList = this.getNoContentDiv(msg)

                    }
                    else{
                        // resultList = <ShotPalette shotData={this.state[getSelectedTab]} currLocation={this.props.location}/>
                        this.state[getSelectedTab].map(ele => 
                            {resultList.push(<Portfolio key={ele.id} data={ele} currLocation={this.props.location} 
                                likePortfolio={this.likeTagRequestShot.bind(this, getSelectedTab)} 
                                unLikePortfolio={this.unLikeTagRequestShot.bind(this, getSelectedTab)} />)
                            return ele
                        })
                        resultList = this.padDummyShot(resultList, this.state.userPortFolio.length, 5)
                        if(this.state.isFetching){
                            resultList = this.padLoaderShot(resultList)
                        }
                    }
                }
                else{
                    
                    if(this.state[getSelectedTab].length === 0){
                        let msg = "No tag requests received !!!"
                        resultList = this.getNoContentDiv(msg)

                    }
                    else{
                        this.state[getSelectedTab].map(ele => 
                            {resultList.push(
                                <div className="tag-req" key={ele.id}>
                                    <div className="tag-decision">
                                        <FaCheckCircle className="tag-decision-btn" onClick={this.approveTag.bind(this, ele.id)}/>
                                        <AiFillCloseCircle className="tag-decision-btn" onClick={this.rejectTag.bind(this, ele.id)} />
                                    </div>
                                    <Portfolio key={ele.id} data={ele} currLocation={this.props.location} 
                                    likePortfolio={this.likeTagRequestShot.bind(this, getSelectedTab)} 
                                    unLikePortfolio={this.unLikeTagRequestShot.bind(this, getSelectedTab)} />
                                </div>
                            )
                            return ele
                        })
                        resultList = this.padDummyShot(resultList, this.state[getSelectedTab].length, 5)
                        if(this.state.isFetching){
                            resultList = this.padLoaderShot(resultList)
                        }

                    }
                    
                }

                
                return(
                    <React.Fragment key={item.title}>
                        {this.state.isSelf? 
                            <div className="profile-tags-selector">
                                <Subnav subNavList={this.state.tagNavOptions} selectSubMenu={this.selectTagNavMenu} getMenuCount={this.getMenuCount}/>
                            </div>
                        : 
                            ""
                        }
                        
                        <div className="profile-portfolio-grid">
                            {resultList}
                        </div>
                        {getSelectedTab === "tagApproved" && (!this.state.tagApprovedPaginator || !this.state.tagApprovedPaginator.next)?
                            <Footer /> : ""
                        }
                        {getSelectedTab === "tagRequests" && (!this.state.tagRequestPaginator || !this.state.tagRequestPaginator.next)?
                            <Footer /> : ""
                        }

                    </React.Fragment>
                )
                
            }
            else if (item.title === "Followers" && item.isActive === true){
                // Followers
                if(!this.state.userFollower){
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                }
                if(!this.state.isAuth){
                    let msg = "You need to signIn to view this !!!"
                    resultList = this.getNoContentDiv(msg)
                }
                else if(this.state.userFollower.length === 0){
                    let msg = "No followers yet !!!"
                    resultList = this.getNoContentDiv(msg)

                }
                else{
                    this.state.userFollower.map((ele, index) => 
                        
                        {resultList.push(<FollowUserCubeAlt key={index} data={ele} isFollowing={ele.is_following} 
                            startFollowing={this.startFollowing.bind(this, ele)} stopFollowing={this.stopFollowing.bind(this, ele)} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userFollower.length, 5)
                    if(this.state.isFetching){
                        resultList = this.padLoaderShot(resultList)
                    }
                }
                
                return (
                    <React.Fragment key={item.title}>
                        <div key={item.title} className="profile-user-grid">
                                {resultList}
                        </div>
                        {!this.state.followerPaginator || !this.state.followerPaginator.next?
                            <Footer /> : ""
                        }
                    </React.Fragment>
                )
            }
            else if (item.title === "Following" && item.isActive === true){
                if(!this.state.userFollowing){
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                }
                if(!this.state.isAuth){
                    let msg = "You need to signIn to view this !!!"
                    resultList = this.getNoContentDiv(msg)
                }

                else if(this.state.userFollowing.length === 0){
                    let msg = "Currently not following anyone !!!"
                    resultList = this.getNoContentDiv(msg)

                }
                else{
                    this.state.userFollowing.map((ele, index) => 
                        {resultList.push(<FollowUserCubeAlt key={index} data={ele} isFollowing={ele.is_following} 
                            stopFollowing={this.stopFollowing.bind(this, ele)} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userFollowing.length, 5)
                    if(this.state.isFetching){
                        resultList = this.padLoaderShot(resultList)
                    }

                }                
                return (
                    <React.Fragment key={item.title}>
                        <div key={item.title} className="profile-user-grid">
                                {resultList}
                        </div>
                        {!this.state.followingPaginator || !this.state.followingPaginator.next?
                            <Footer /> : ""
                        }
                    </React.Fragment>
                    )
            }
            else if (item.title === "Reviews" && item.isActive === true){
                // USER reviews
                let comp = <CommunityReview key={item.title} showSubNav={false} headMessgae={"Public reaction about this profile"}
                username={this.state.userAbout.username} isSelf={this.state.isSelf}/>
                if(this.props.isAuthenticated){
                    return (<div className="activated-nav" key="r-plt">{comp}</div>)
                }
                else{
                    return comp
                }
                
            }

            else if(item.title === "Saved" && item.isActive === true){
                // Saved
                if(!this.state.userSaved){
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                }
                if(this.state.userSaved.length === 0){
                    let msg = "Saved contents will appear here."
                    resultList = this.getNoContentDiv(msg)

                }
                else{
                    this.state.userSaved.map(ele => 
                        {resultList.push(
                            <div className="tag-req saved-content" key={ele.id}>
                                <div className="tag-decision">
                                    <AiFillCloseCircle className="tag-decision-btn" onClick={this.removeFromSaved.bind(this, ele.id)} />
                                </div>
                                <Portfolio key={ele.id} data={ele} currLocation={this.props.location} onlyShots={true} />
    
                            </div>
                        )
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userSaved.length, 5)
                    if(this.state.isFetching){
                        resultList = this.padLoaderShot(resultList)
                    }
                }
                
                return(
                    <React.Fragment key={item.title}>
                        <div key={item.title} className="profile-portfolio-grid">
                            {resultList}
                        </div>
                        {!this.state.savedPaginator || !this.state.savedPaginator.next?
                            <Footer /> : ""
                        }
                    </React.Fragment>
                )
            }
            return <React.Fragment key={"default "+ index}></React.Fragment>
        })
        return resultBlock
    }
    updateReaction = (rev) =>{
        let userAbout = this.state.userAbout
        userAbout.review = rev
        this.setState({userAbout: userAbout})
    }

    forceRerenderOnce = (renderKey) =>{
        // to be unpdated only once
        if(this.state.forceRerender=== false){
            this.setState({
                [renderKey]: null,
                forceRerender: true,
            }, ()=>{
                this.retrieveDataFromAPI(renderKey, this.updateStateOnAPIcall)
            })
            
        }
    }

    BlockUnblock = () =>{
        let userAbout = this.state.userAbout
        userAbout.is_blocked = !userAbout.is_blocked
        this.setState({userAbout:userAbout})
    }

    render() {
        if (this.props.AuthenticatedOnly && this.state.isSelf === false){
            return(<Redirect to={{ pathname: "/page-404/" }} />)
        }
        if(this.props.location.state && this.props.location.state.rerender){
            this.forceRerenderOnce(this.props.location.state.rerender)
            
        }
        if(!this.state.userAbout){
            return(<React.Fragment>
                    <OwlLoader />
                    <Footer />
                </React.Fragment>)
        }
        let resultBlock = this.getCompomentData()
        return (
            <React.Fragment>
                {this.state.editProf?
                <EditProfile closeModal={this.editProfile}/>
                :
                ""
                }
                {/* <SearchHead /> */}
                {this.props.showNav === false?
                ""
                :
                this.props.isAuthenticated || this.state.isSelf?
                    <UserNavBar selectedMenu={"profile"} username={this.state.userAbout.username}/>
                    :
                    <SearchHead />
                }
                
                {/* profile top section */}
                <ProfileHead data={this.state.userAbout} isSelf={this.state.isSelf} editProfile={this.editProfile} 
                uploadPicture={this.uploadPicture} isAuth={this.state.isAuth} currLocation={this.props.location}
                startStopFollowingProfile={this.startStopFollowingProfile} BlockUnblock={this.BlockUnblock}
                 />
                 {/* intor div */}
                {!this.state.isSelf && ['Shots', 'Portfolios'].includes(this.state.subNavList.filter(ele => ele.isActive)[0].title)? 
                <UserIntro data={this.state.userAbout} isAuth={this.state.isAuth} updateReview={this.updateReaction} /> : ""}
                {/* subnav menu */}
                <Subnav subNavList={this.state.subNavList} selectSubMenu={this.selectSubMenu}  getMenuCount={this.getMenuCount}/>
                {/* result Component */}
                {resultBlock}
            </React.Fragment>
        )
    }
}


function ProfileHead(props) {
    let data = props.data;

    // states
    const [userActions, showUserActions] = useState(false);
    const [blockModal, showBlockModal] = useState(false);
    const [reportModal, showReportModal] = useState(false);
    const [chatBox, showChatBox] = useState(false);

    if (!props.data){
        return(
        <div className="profile-top">
            <OwlLoader />
        </div>
        )
    }
    // console.log("chatBox status", chatBox)    
    let coverpic = data.profile_data && data.profile_data.cover_pic ? data.profile_data.cover_pic: defaultCoverPic();
    let chatBoxUser ={id: data.username, username: data.username, name: data.name, 
        profile_pic: data.profile_data && data.profile_data.profile_pic? data.profile_data.profile_pic: null}
    return (
        <React.Fragment>
            <div className="profile-top">
                <div className="p-cover">
                    {props.isSelf?
                    <span className="edit-coverpic">
                        <input type="file" className="pic-uploader" onChange={ e => props.uploadPicture(e, 'cover_pic')}/>
                        <FaCameraRetro  className="cam-icon"/>
                    </span>
                    :
                    ""
                    }
                    
                    <img className="p-cover-img" src={coverpic} alt="" />
                    <div className="p-user">
                        <div className="p-user-img-back">
                                {data.profile_data && data.profile_data.profile_pic?
                                    <img className="p-user-img" src={data.profile_data.profile_pic} alt="" />
                                    :
                                    <FaUserCircle className="p-user-img default-user-logo" />
                                    }
                           
                            {props.isSelf?
                                <span className="edit-pic">
                                    <input type="file" className="pic-uploader" onChange={ e => props.uploadPicture(e, 'profile_pic')}/>
                                    <FaCameraRetro  className="cam-icon"/>
                                </span>
                                :
                                ""
                            }
                            
                        </div>
                        
                        <span className="p-display-name">{data.name}
                            <span className="p-adj-username">@{data.username}</span>
                            <span className="p-adj">
                            {(data.profile_data && data.profile_data.profession)? data.profile_data.profession:""}
                                </span>
                            {props.isSelf?
                                <button className="btn m-fuser" onClick={props.editProfile}>< TiEdit className="ico"/>Edit Profile</button>
                            :
                                <div className="pf-otheruser-btns">
                                    {data.is_following?
                                        props.isAuth?
                                            <button className="btn m-fuser" onClick={()=>showChatBox(true)}><FaPaperPlane className="ico"/> Message</button>
                                            :
                                            <Link className="btn m-fuser" to={{
                                                pathname: `/m-auth/`,
                                                state: { modal: true, currLocation: props.currLocation }
                                            }}
                                            ><FaPaperPlane className="ico"/> Message</Link>
                                    :
                                        props.isAuth?
                                            !data.is_blocked?
                                                <button className="btn m-fuser" onClick={() => {
                                                    FollowUnfollowUser(data, props.startStopFollowingProfile)
                                                    UpdateRecentFriends("follow", ConstructUserRecord(data))
                                                    }}>
                                                    <FaPlus className="ico"/> Follow</button>
                                                :
                                                ""
                                            :
                                            <Link className="btn m-fuser" to={{
                                                pathname: `/m-auth/`,
                                                state: { modal: true, currLocation: props.currLocation }
                                            }}
                                            ><FaPlus className="ico"/> Follow</Link>
                                    }
                                    {props.isAuth?
                                    <button className="btn m-fuser" onClick={()=> showUserActions(!userActions)}>
                                    <AiFillSetting className="ico"/> Actions</button>
                                    :
                                    <Link className="btn m-fuser" to={{
                                        pathname: `/m-auth/`,
                                        state: { modal: true, currLocation: props.currLocation }
                                    }}
                                    ><AiFillSetting className="ico"/> Actions</Link>
                                    }
                                    
                                    {userActions?
                                        <div className="user-action-menu">
                                            {data.is_following?
                                            <div className="a-opt" 
                                            onClick={() => {
                                                FollowUnfollowUser(data, props.startStopFollowingProfile)
                                                UpdateRecentFriends("unfollow", ConstructUserRecord(data))
                                            }}>Unfollow</div> : ""
                                            }
                                            <div className="a-opt" onClick={()=>showChatBox(true)}>Message</div>
                                            {data.is_blocked?
                                                <div className="a-opt" 
                                                onClick={()=> BlockUser(data.username, ()=>{props.BlockUnblock()})}>Unblock</div>
                                                :
                                                <div className="a-opt" onClick={()=> showBlockModal(!blockModal)}>Block</div>
                                            }
                                            
                                            <div className="a-opt" onClick={()=> showReportModal(!reportModal)}>Report</div>
                                        </div>
                                        :
                                        ""
                                    }
                                </div>
                                
                            }
                            
                        </span>
                        {reportModal?
                            <div className="profile-report-screen">
                                <div className="report-profile">
                                    <div className="pop-up-close" onClick={()=>showReportModal(!reportModal)}>
                                        <AiFillCloseCircle /></div>
                                    <ReportContent reportUser={true} contentId={data.username}/>
                                </div>
                            </div>
                            :
                        ""}
                        {blockModal?
                            <div className="profile-report-screen">
                                <ConfirmationPopup 
                                confMessage={"Are you sure to block this account?"}
                                prvBtnClick={()=>showBlockModal(!blockModal)}
                                onContinue={()=>{ BlockUser(data.username, ()=>{
                                    showBlockModal(!blockModal)
                                    props.BlockUnblock()
                                }) }}
                                />
                            </div> 
                            :
                            ""
                        }
                        {chatBox?
                            <div className="chat-short">
                                <Chatbox chatBoxUser={chatBoxUser} moveToOpenChats={null} 
                                closeChat={()=>showChatBox(false)}/>
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


class UserIntro extends Component{
    selectReaction = (key) =>{
        let newrev = this.createReviewobject(key)
        if (this.props.data.review.id){
            // update review
            UpdateUserReviewsAPI(this.props.data.username, newrev, this.successfulUpdate.bind(this, newrev))
        }
        else{
            AddUserReviewsAPI(this.props.data.username, newrev, this.successfulUpdate.bind(this, newrev))
        }
    }
    createReviewobject = (newReaction) =>{
        let newRev = ''
        if (this.props.data.review.id){
            let rev = this.props.data.review
            newRev = {
                id: rev.id, review: {text: rev.text, reaction: newReaction}
            }
        }
        else{
            newRev = {
                id: generateId(), 
                review: { text: "", reaction: newReaction},
            }

        }
        return newRev
    }

    successfulUpdate = (rev, response) =>{
        let rv = {"id": rev.id ,"text": rev.review.text, "reaction": rev.review.reaction}
        this.props.updateReview(rv)
    }

    render(){
        let data = this.props.data
        return(
            <div className="user-intro">
                <div className={this.props.isAuth?"bio-div": "bio-div bio-div-full"}>
                    <h4>Bio</h4>
                    <div className="u-content-datadiv">
                        <p>{data.profile_data && data.profile_data.bio? data.profile_data.bio: "Not updated by user"}</p>
                    </div>
                </div>
                {this.props.isAuth?
                    <div className="rate-div">
                        <span className="rate-head-text">Let <span className="username">{data.username}</span> know that you appriciate their creativity.<br/>
                        Drop a reaction</span>
                        <ReactionPalette selectReaction={this.selectReaction} reaction={data.review.reaction} />
                    </div>
                :
                    ""
                }
            </div>
            
        )

    } 
}