import React, { Component } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane , FaCheckCircle, FaCameraRetro, FaUserCircle} from "react-icons/fa";
import { AiFillCloseCircle } from 'react-icons/ai';
import SearchHead from '../components/Search/SearchHead';
import Subnav from '../components/Navbar/Subnav';
import UserAbout from '../components/Profile/UserAbout';
import {Shot, ShotPalette} from '../components/Post/Shot';
import Portfolio from '../components/Profile/Portfolio';
import AddPost from '../components/Post/AddPost';
import Footer from '../components/Footer';
import {FollowUserCube} from '../components/Profile/UserView';
import DummyShots from '../components/Post/DummyShots';
import {generateId, isSelfUser} from '../utility/Utility.js';
import NoContent from '../components/NoContent';
import CommunityReview from '../pages/CommunityReview'
import { UserNavBar } from '../components/Navbar/Navbar';
import { TiEdit } from 'react-icons/ti';
import EditProfile from '../components/Profile/EditProfile';
import ImgCompressor from '../utility/ImgCompressor';
import {defaultCoverPic} from '../utility/userData';
import { retrieveFromStorage, saveInStorage } from '../utility/Utility';
import HTTPRequestHandler from '../utility/HTTPRequests';
import { createFloatingNotification } from '../components/FloatingNotifications';
import { Redirect } from 'react-router-dom';
import OwlLoader from '../components/OwlLoader';



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

export default class Profile extends Component {
    state = {
        subNavList:[],

        tagNavOptions:[
            {key: "tn-1", "title": "Approved", "count": true, "isActive": true},
            {key: "tn-2", "title": "Requests", "count": true, "isActive": false}
        ],

        userPortFolio : null,
        userTag:{
            approved : [
                // {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: pl2, is_liked: false}, 
                // {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1, is_liked: false}, 
            ],
            requests: [
                // {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: pl2, is_liked: false}, 
                // {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1, is_liked: false}, 
            ]
        },
        userFollower:[
            // {"id": 1, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer", "isFollowing": false},
            // {"id": 2, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer", "isFollowing": false}
        ],
        userFollowing:[
            // {"id": 11, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer", "isFollowing": true},
            // {"id": 12, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer", "isFollowing": true}
        ],
        
        userAbout:JSON.parse(retrieveFromStorage("user_data")),

        // userSaved: [
        //     {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1], likes: 100, comments: 100, shares:0,}, 
        //     {id: 2, name:"p2", shot: [w1], likes: 100, comments: 100, shares:0,}, 
        //     {id: 3, name:"p4", shot: [w1, pl2, w1], likes: 100, comments: 100, shares:0,},
        //     {id: 4, name:"p4", shot: [w1, pl2, w1, pl2], likes: 100, comments: 100, shares:0,},
        // ],
        userSaved : null,
        isSelf : null,
        editProf: false,
    }

    componentDidMount(){
        // get user portfolio data
        let subnav = ''
        let isSelf = false
        let userAbout = ''
        if(this.props.isAuthenticated && isSelfUser(this.state.userAbout.username, this.props.match.params.username)){
            subnav = AuthUserNav;
            isSelf = true;
            userAbout = JSON.parse(retrieveFromStorage("user_data"))
        }
        else{
            subnav = PublicNav;
            // call api to get user about
            userAbout = JSON.parse(retrieveFromStorage("user_data"))

        }
        let qstr = new URLSearchParams(this.props.location.search);
        let activeTab = qstr.get('active');
        // console.log("active tab", activeTab);
        if(activeTab){
            subnav.map(ele=>{
                if(ele.title.toLowerCase()=== activeTab.toLowerCase()){
                    ele.isActive = true;
                }
                else{
                    ele.isActive = false
                }
                return ele
            })
        
        }
        else{
            activeTab = 'Shots'
            this.retrieveDataFromAPI(activeTab, this.updateStateOnAPIcall)   
        }
        this.setState({
            subNavList: subnav, isSelf: isSelf, userAbout: userAbout
        })
    }

    getStateKeyFromSubmenuName = (name) =>{
        switch(name){
            case 'Shots':
                return 'userPortFolio'
            
            case 'Portfolio':
                return 'userPortFolio'
            
            case 'Saved':
                return 'userSaved'
            
            case 'Followers':
                return 'userFollower'

            case 'Following':
                return 'userFollowing'
            
            default: return null
        }

    }

    getAPIUrl = (key) =>{
        switch(key){
            case 'Shots':
                return 'api/v1/view-post/'+ this.props.match.params.username + '/'

            case 'Portfolios':
                return 'api/v1/view-post/'+ this.props.match.params.username + '/'

            case 'Saved':
                return 'api/v1/save-post/'

            default: return null

        }

    }

    retrieveDataFromAPI = (selectedMenu, callbackFunc)=>{
        let url = this.getAPIUrl(selectedMenu)
        if (url){
            let stateKey = this.getStateKeyFromSubmenuName(selectedMenu)
            HTTPRequestHandler.get(
                {url:url, includeToken:true, callBackFunc: callbackFunc.bind(this, stateKey), 
                errNotifierTitle:"Update failed !"})
        }
    } 

    updateStateOnAPIcall = (key, data)=>{
        // console.log("updateStateOnAPIcall", key, data)
        if('count' in data && 'next' in data && 'previous' in data){
            // paginated response
            this.setState({
                [key]: data.results
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
        // switch (key) {
        //     case "Shots":
        //         return this.state.userPortFolio.length;
        //     case "Portfolios":
        //         return this.state.userPortFolio.length;
        //     case "Tags":
        //         // default is approved tag values
        //         return this.state.userTag.approved.length;
        //     case "Followers":
        //         return this.state.userFollower.length;
        //     case "Following":
        //         return this.state.userFollowing.length;
        //     case "Approved":
        //         // approved tags
        //         return this.state.userTag.approved.length;
        //     case "Requests":
        //         // requested tags
        //         return this.state.userTag.requests.length;
        //     case "Saved":
        //         return this.state.userSaved.length;
        //     default:
        //         return 0
        // }
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
                }
                else{
                    item.isActive = false;
                }
                return item
            })
        })
    }
    
    likeTagRequestShot = (idx) => {
        // api call to update likes
        // also increase the count

        let updatedUserTag = {...this.state.userTag}

        updatedUserTag.requests.map(ele => ele.id === idx? ele.is_liked=true : '') 

        this.setState({
            userTag: updatedUserTag
        })
    }

    unLikeTagRequestShot = (idx) => {
        // api call to update likes
        // also decrease the count

        let updatedUserTag = {...this.state.userTag}

        updatedUserTag.requests.map(ele => ele.id === idx? ele.is_liked=false : '')
        
        this.setState({
            userTag: updatedUserTag
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
        let newUsertag = {...this.state.userTag};
        //  get item
        let item = newUsertag.requests.filter(ele=> ele.id===idx)[0];
        // remove from request list
        newUsertag.requests = [...newUsertag.requests.filter(ele=> ele.id!== idx)]
        // add to approve list
        item.id = generateId();
        newUsertag.approved.push(item);
        // update state
        this.setState({ userTag: newUsertag})
       
    }
    rejectTag = (idx) =>{
        let newUsertag = {...this.state.userTag};
        // remove from request list
        newUsertag.requests = [...newUsertag.requests.filter(ele=> ele.id!== idx)]
        // update state
        this.setState({ userTag: newUsertag})
    }

    startFollowing =(record) =>{
        record.isFollowing = true;
        if (isSelfUser(2,1)){
            this.setState({
                userFollowing: [...this.state.userFollowing, record]
            })
        }
    }

    stopFollowing =(record) =>{
        record.isFollowing = false;
        this.setState({
            userFollowing: this.state.userFollowing.filter(ele => ele.id!==record.id) 
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
                resultList.push(<DummyShots  key={"DS"+ i }/>)
            }
        }
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
        let url = 'api/v1/user-profile/'
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
            if(item.title === "Shots" && item.isActive === true){

                // SHOTS
                if (this.state.userPortFolio && this.state.userPortFolio.length === 0){
                    let msg = "No shots yet !!!"
                    resultList = this.getNoContentDiv(msg);
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {resultList}
                            {this.state.isSelf?
                            <AddPost onSuccessfulUpload={this.addNewPortfolioToState} />
                            :
                            ""}
                            
                        </div>
                    )
                }
                else if (this.state.userPortFolio && this.state.userPortFolio.length > 0){
                    // get all shots
                    this.state.userPortFolio.map(portfolio => {
                        portfolio.attachments.reverse().map(ele=>{
                            let data ={
                                id: ele.id, name: portfolio.user.name, username: portfolio.user.username, content: ele.content, 
                                interactions: portfolio.interactions, portfolio_id: portfolio.id
                            }
                            resultList.push(<Shot key={data.id} id={data.id} onlyShot={true} data={data} currLocation={this.props.location} />)
                            return ele
                        })
                        return portfolio
                    })
                    resultList = this.padDummyShot(resultList, resultList.length, 5)
                    return(
                        <div key={item.title} className="profile-shots">
                            {resultList}
                            {this.state.isSelf?
                            <AddPost onSuccessfulUpload={this.addNewPortfolioToState} />
                            :
                            ""}
                        </div>
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
                }
                else {
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                }
                
                return(
                    <div key={item.title} className="profile-portfolio-grid">
                        {resultList}
                        {this.state.isSelf?
                        <AddPost />
                        :
                        ""}
                    </div>
                )
            }
            else if (item.title === "Tags" && item.isActive === true){
                // TAG LIST
                // get requested or approve tab
                let getSelectedTab = this.state.tagNavOptions.filter(ele => ele.isActive === true)[0]
                // getSelectedTab.toLowerCase()
                getSelectedTab = getSelectedTab.title.toLowerCase();
                // console.log("selected tab ", getSelectedTab);

                if(!this.state.userTag[getSelectedTab]){
                    return(
                        <div key={item.title} className="profile-portfolio-grid">
                            {this.getLoaderDIv()}                        
                        </div>
                    )

                } 
                if (getSelectedTab === "approved"){
                    if(this.state.userTag[getSelectedTab] && this.state.userTag[getSelectedTab].length === 0){
                        let msg = "No tags made it upto here !!!"
                        resultList = this.getNoContentDiv(msg)

                    }
                    else{
                        resultList = <ShotPalette shotData={this.state.userTag[getSelectedTab]} currLocation={this.props.location}/>
                    }
                }
                else{
                    
                    if(this.state.userTag[getSelectedTab].length === 0){
                        let msg = "No tag requests received !!!"
                        resultList = this.getNoContentDiv(msg)

                    }
                    else{
                        this.state.userTag[getSelectedTab].map(ele => 
                            {resultList.push(
                                <div className="tag-req" key={ele.id}>
                                    <div className="tag-decision">
                                        <FaCheckCircle className="tag-decision-btn" onClick={this.approveTag.bind(this, ele.id)}/>
                                        <AiFillCloseCircle className="tag-decision-btn" onClick={this.rejectTag.bind(this, ele.id)} />
                                    </div>
                                    <Shot  id={ele} data={ele} currLocation={this.props.location} likeShot={this.likeTagRequestShot} 
                                    unLikeShot={this.unLikeTagRequestShot}/>
                                </div>
                            
                            )
                            return ele
                        })
                        resultList = this.padDummyShot(resultList, this.state.userTag[getSelectedTab].length, 5)

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
                if(this.state.userFollower.length === 0){
                    let msg = "No followers yet !!!"
                    resultList = this.getNoContentDiv(msg)

                }
                else{
                    this.state.userFollower.map(ele => 
                        {resultList.push(<FollowUserCube key={ele.id} data={ele} isFollowing={ele.isFollowing} 
                            startFollowing={this.startFollowing} stopFollowing={this.stopFollowing} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userFollower.length, 5)
                }
                
                return (
                <div key={item.title} className="profile-user-grid">
                        {resultList}
                </div>
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

                if(this.state.userFollowing.length === 0){
                    let msg = "Currently not following anyone !!!"
                    resultList = this.getNoContentDiv(msg)

                }
                else{
                    this.state.userFollowing.map(ele => 
                        {resultList.push(<FollowUserCube key={ele.id} data={ele} isFollowing={ele.isFollowing} 
                            stopFollowing={this.stopFollowing} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userFollowing.length, 5)

                }
                
                return (
                    <div key={item.title} className="profile-user-grid">
                            {resultList}
                    </div>
                    )
            }

            else if (item.title === "About" && item.isActive === true){
                // USER ABOUT
                return (<UserAbout key={item.title} data={this.state.userAbout}/>)
            }

            else if (item.title === "Reviews" && item.isActive === true){
                // USER reviews
                let comp = <CommunityReview key={item.title} showSubNav={false} headMessgae={"Public reaction about this profile"}
                requireFooter={false}/>
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
                }
                
                return(
                    <div key={item.title} className="profile-portfolio-grid">
                        {resultList}
                    </div>
                )
                

            }
            return <React.Fragment key={"default "+ index}></React.Fragment>
        })
        return resultBlock
    }

    render() {
        if (this.props.AuthenticatedOnly && this.state.isSelf === false){
            return(<Redirect to={{ pathname: "/page-404/" }} />)
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
                this.props.isAuthenticated?
                <UserNavBar selectedMenu={"profile"} username={this.state.userAbout.username}/>
                :
                <SearchHead />
                }
                
                {/* profile top section */}
                <ProfileHead data={this.state.userAbout} isSelf={this.state.isSelf} editProfile={this.editProfile} 
                uploadPicture={this.uploadPicture} />
                <Subnav subNavList={this.state.subNavList} selectSubMenu={this.selectSubMenu}  getMenuCount={this.getMenuCount}/>
                {/* result Component */}
                {resultBlock}
                <Footer />
            </React.Fragment>
        )
    }
}


function ProfileHead(props) {
    let data = props.data;
    let coverpic = data.profile_data && data.profile_data.cover_pic ? data.profile_data.cover_pic: defaultCoverPic();
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
                                    <button className="btn m-fuser">< FaPlus className="ico"/> Follow</button>
                                    <button className="btn m-fuser">< FaPaperPlane className="ico"/> Message</button>
                                </div>
                                
                            }
                            
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
