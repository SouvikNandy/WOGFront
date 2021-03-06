import React, { Component } from 'react';
import '../../assets/css/settings.css';
import '../../assets/css/shotmodalview.css';

import { FaPlus, FaCheckDouble } from "react-icons/fa";
import { AiFillLeftCircle, AiFillRightCircle, AiOutlineCopyright, AiOutlineTag } from "react-icons/ai";
import { FiBellOff, FiBell } from 'react-icons/fi';
import {BsThreeDotsVertical} from "react-icons/bs";
import {GoReport} from "react-icons/go";
import ModalLikes from './ModalLikes';
import ModalComments from './ModalComments';
import GoBack from "../GoBack";
import { UserFlat, UserLogoWithUserName } from '../Profile/UserView';
import TagUser from '../Profile/TagUser';
import SideBar from '../SideBar';
import ReportContent from './ReportContent'

import {msToDateTime, isSelfUser, retrieveFromStorage, isAuthenticated, getFrontendHost} from '../../utility/Utility'

import HTTPRequestHandler from '../../utility/HTTPRequests';
import OwlLoader from '../OwlLoader';
import { Link } from 'react-router-dom';
import { LikePostAPI, RemoveTagAPI, SavePostAPI, turnCommentsOnOffAPI } from '../../utility/ApiSet';
import { EditorSpan, JSONToEditState } from '../TextInput';
import getUserData, { defaultProfilePic } from '../../utility/userData';
import { Context } from '../../GlobalStorage/Store';



export class ShotModalView extends Component {
    static contextType= Context
    state = {
        shot: null,
        selected_shot_id: '',

        // sidebar states
        showSideView: false,
        sideViewContent: [],
        sideBarFullScreen: false,
        altHeadText: null,

        // report image
        reportBox: false,
        isSelf: false,

        isAuth: false,
    }

    componentDidMount(){
        // console.log("ShotModalView", this.props)
        let param = this.props.match.params.id
        let [username, portfolio_id, shot_id] = param.split("-");
        // get portfolio details
        let url = "api/v1/view-post/" + username + '/?q='+portfolio_id+'&r='+ window.innerWidth
        HTTPRequestHandler.get({url:url, includeToken:isAuthenticated(), 
            callBackFunc: this.updateStateOnAPIcall.bind(this, shot_id, username),
            errCallBackFunc: this.onErrCallBack.bind(this, username)
        })
    }
    onErrCallBack = (username, err) =>{
        this.props.history.goBack();
    }

    getShotData = () =>{
        return this.state.shot
    }

    updateStateOnAPIcall = (shot_id, username, data) =>{
        let isAuth = isAuthenticated();
        let isSelf = false
        
        if(isAuth){
            let currentUser = JSON.parse(retrieveFromStorage('user_data')).username
            isSelf = isSelfUser(username, currentUser)
        }
        // console.log("shot modal", data.data)
        this.setState({shot: data.data, selected_shot_id: shot_id, isSelf: isSelf, isAuth: isAuth })
    }

    doLike = () => {
        // api call to update likes
        // also increase the count
        var shot = { ...this.state.shot };
        shot.is_liked = true;
        shot.interactions.likes++;
        this.setState({ shot });
        let requestBody = {post_id: shot.id}
        // update in feeds cache
        this.likeInCache(shot.id)

        LikePostAPI(requestBody, null)
    }

    likeInCache = (idx)=>{
        let feed_id = null
        let updatedFeeds = this.context[0].feeds
        let paginator = this.context[0].paginator

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
        }
    }

    doUnLike = () => {
        // api call to update likes
        // also decrease the count
        var updatedshot = { ...this.state.shot };
        updatedshot.is_liked = false;
        updatedshot.interactions.likes--;
        this.setState({ shot: updatedshot })
        let requestBody = {post_id: updatedshot.id}
        // update in feeds cache
        this.likeInCache(updatedshot.id)
        LikePostAPI(requestBody, null)
    }

    dislikeInCache = (idx)=>{
        let feed_id = null
        let updatedFeeds = this.context[0].feeds
        let paginator = this.context[0].paginator

        updatedFeeds.map(ele =>{
            if(ele.id === idx){
                ele.is_liked = true;
                ele.interactions.likes--;
                feed_id= ele.id;
            }
            return ele
        })
        if(feed_id){
            this.context[1]({type: 'SET_POSTS', payload: {feeds: updatedFeeds, paginator: paginator, feeds_updated: this.context[0].feeds_updated}});
        }
    }

    savePost = () =>{
        var shot = { ...this.state.shot };
        if(!shot.is_saved){
            shot.is_saved = true;
        }
        else{
            shot.is_saved = !shot.is_saved;
        }
        this.setState({ shot : shot });
        
        let requestBody = {post_id: shot.id}
        this.saveInCache(shot.id)
        SavePostAPI(requestBody, null)
    }

    saveInCache = (idx) =>{
        let feed_id = null
        let updatedFeeds = this.context[0].feeds
        let paginator = this.context[0].paginator
        
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

        }
        
    }

    followUser = () =>{
        // follow unfollow user
        let prevShot = this.state.shot;
        prevShot.user.is_following = !prevShot.user.is_following;
        this.setState({
            shot: prevShot
        })
    }


    getSidebarDisplayImg = (imageObj) =>{
        return (<div className="side-bar-full-img"><img className="side-bar-display-img" alt="" src={imageObj} /></div>)
    }

    displayFullSizeImagePreview = (imageObj) =>{
        this.setState({
            showSideView: true,
            sideViewContent: imageObj,
            sideBarFullScreen: true

        })

    }

    displaySideView = ({content, sureVal, altHeadText=null}) =>{
        // console.log("displaySideView evoked", content, sureVal)
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            altHeadText: altHeadText
        })

        if(content){
            this.setState({
                sideViewContent: content,
                
            })
        }

        // if sideBarFullScreen is turned on make it off
        if (this.state.sideBarFullScreen===true){
            this.setState({
                sideBarFullScreen: false
            })
        }
    }

    onRemoveMember = (idx) => {
        let newShot = this.state.shot;
        let newTagList = newShot.tags.filter(item => item.id !== idx);
        newShot["tags"] = newTagList;

        this.setState({
            shot: newShot,
            sideViewContent: [...this.state.sideViewContent.filter(item => item.props.data.id !== idx)],
        });

    }


    showReportOptions = () =>{
        this.setState({reportBox : !this.state.reportBox})
    }

    removeTag = () =>{
        let pid = this.state.shot.id
        let currentUser = getUserData()
        let updatedShot = this.state.shot
        let updatedMembers = updatedShot.members.filter(ele=> ele.username !==currentUser.username)
        updatedShot.members = updatedMembers
        this.setState({
            shot: updatedShot
        })
        RemoveTagAPI(pid, currentUser.username, null)
    }
    toggleCommentsSettings = () =>{
        let shot = this.state.shot
        shot.interactions.comments_enable = !shot.interactions.comments_enable
        this.setState({shot: shot})
        turnCommentsOnOffAPI(shot.id, null)
    }

    getPortFolioLink = (onlyKey=false) =>{
        let data = this.state.shot
        if (onlyKey){
            return data.user.username +'-'+ data.id +'-'+ data.attachments[0].id
        }
        else{
            return getFrontendHost()+'/shot-view/'+ data.user.username +'-'+ data.id +'-'+ data.attachments[0].id
        }
    }
    
    render() {
        // if component not loaded yet return
        // console.log(this.props)
        let currLocation = ''
        try{
            currLocation = this.props.location.state.currLocation
        }
        catch{
            currLocation = this.props.location
        }

        let classNamePrefix = this.props.location.state?"bg-modal" : "bg-modal bg-dark"

        if(!this.state.shot){
            return(
                <div className={classNamePrefix+" full-width"}><OwlLoader /></div>
                )
        }
        let maxCount = window.innerWidth > 700? 3: 2;

        let tagList = [];
        let existingList = [];

        // add all members to show
        if(this.state.shot && this.state.shot.members){
            this.state.shot.members.map( item =>{
                existingList.push(<TagUser key={item.id} data={item}/>)
                return existingList
                    
            })

            if (this.state.shot.members.length > maxCount){
                let tagUsers =  this.state.shot.members
                let remainingTagsCount = tagUsers.length - maxCount
                for(let i=0; i<maxCount; i++){
                    tagList.push(<span key={tagUsers[i].id}>
                        <img className="tag-img" src={tagUsers[i].profile_pic? tagUsers[i].profile_pic: defaultProfilePic()} alt={tagUsers[i].username}/></span>)
                }
                tagList.push(<span key="tag-img-count" className="tag-img-count" 
                onClick={this.displaySideView.bind(this, {content: existingList, sureVal: true})}>+{remainingTagsCount}</span>)
            }
            else{
                this.state.shot.members.map(ele => {
                    tagList.push(<span key={ele.id}><img className="tag-img" 
                    src={ele.profile_pic? ele.profile_pic: defaultProfilePic()} alt={ele.username}/></span>)
                    return ele
                })

            }

            if(this.state.shot.members.length> 0){
                tagList.push(
                    <button key="review-tags" className="btn-anc review-tags" 
                    onClick={this.displaySideView.bind(this, {content: existingList, sureVal: true, altHeadText: "People tagged"})}>Review all tags</button>
                )
    
            }
        }

        //  check if user is tagged
        let currentUser = getUserData()
        let isUserTagged = false
        if(currentUser !==null){
            if(this.state.shot.members.length> 0 && this.state.shot.members.filter(ele=> ele.username ===currentUser.username).length> 0){
                isUserTagged = true
            }

        }

        
        return (
            <React.Fragment>
                
                <div className={this.state.showSideView? classNamePrefix+" with-side-width": classNamePrefix+" full-width"}>
                
                    <div className={this.state.showSideView?"modal-content-grid modal-grid-only-img": "modal-content-grid"}>
                        {/* Modal Image */}
                        <section className="modal-imgbox">
                            
                            
                            <div className="m-options fade-down">
                                <div className="m-options-menu">
                                        <GoBack activeIcon={true} clickMethod={this.props.openModalView} />
                                        {this.state.isAuth?
                                            <BsThreeDotsVertical className="close-btn" onClick={this.showReportOptions}/>
                                            :
                                            ""
                                        }
                                        

                                        {this.state.reportBox?
                                            <div className="report-box">
                                                {this.state.isSelf?
                                                    <React.Fragment>
                                                        <Link className="link r-opt"
                                                        to={{
                                                            pathname: this.state.shot.is_shared_content?`/edit-shared/${this.props.match.params.id}`: `/edit-shot/${this.props.match.params.id}`,
                                                            // This is the trick! This link sets
                                                            // the `background` in location state.
                                                            state: { modal: true, currLocation: currLocation }
                                                        }}
                                                        >
                                                            <GoReport className="close-btn" />
                                                            <span>Edit Portfolio</span>
                                                        </Link>
                                                        {this.state.shot.interactions.comments_enable?
                                                            <div className="r-opt" onClick={this.toggleCommentsSettings}>
                                                                <FiBellOff className="close-btn" />
                                                                <span>Turn off comments</span>
                                                            </div>
                                                            :
                                                            <div className="r-opt" onClick={this.toggleCommentsSettings}>
                                                                <FiBell className="close-btn" />
                                                                <span>Turn on comments</span>
                                                            </div>
                                                        }
                                                        

                                                    </React.Fragment>
                                                    :
                                                    <React.Fragment>
                                                        {isUserTagged?
                                                            <div className="r-opt"
                                                            onClick={this.removeTag}
                                                            >
                                                                <AiOutlineTag className="close-btn" />
                                                                <span>Remove Tag</span>
                                                            </div>
                                                            :
                                                            ""
                                                        
                                                        }
                                                        <div className="r-opt"
                                                        onClick={this.displaySideView.bind(this, 
                                                            {content: <ReportContent contentId={this.state.shot.id}/>, sureVal: true})}
                                                        >
                                                            <GoReport className="close-btn" />
                                                            <span>Report content</span>
                                                        </div>
                                                        <div className="r-opt"
                                                        onClick={this.displaySideView.bind(this, 
                                                            {content: <ReportContent 
                                                                copyrightClaim={true} contentId={this.state.shot.id}/>, sureVal: true})}
                                                        >
                                                            <AiOutlineCopyright className="close-btn" />
                                                            <span>Claim copyright</span>
                                                        </div>

                                                    </React.Fragment>
                                                
                                                }
                                                
                                            </div>
                                            :
                                            ""
                                        }
                                </div>
                                
                            </div>
                            {/* preview image */}
                            <ImageSlider attachments={this.state.shot.attachments} selected_shot_id={this.state.selected_shot_id} 
                            pricingContainer={this.state.shot.pricing_container} 
                            showUser={this.state.shot.is_shared_content?this.state.shot.actual_post: false}/>

                            <div className="m-img-attribute fade-up">
                                <span className="p-attr-name">
                                    <div className="m-display-name">{this.state.shot.portfolio_name}</div>
                                    <span className="m-dt">{msToDateTime(this.state.shot.created_at)} </span>
                                </span>
                                <span className="p-attr-tags">
                                        {tagList}
                                </span>
                            </div>
                        </section>
                        {/* Modal User */}
                        <section className={this.state.showSideView?"modal-user hide": "modal-user"}>
                            <span className="m-attribution-user">
                                <span className="m-user-preview">
                                    {this.state.shot.location?
                                    <UserFlat data={this.state.shot.user} tagText={this.state.shot.location} />
                                    :
                                    <UserFlat data={this.state.shot.user}/>
                                    }
                                    
                                </span>
                            </span>
                            {this.state.isSelf || !this.isAuth?
                            ""
                            :
                            <span className="m-follow">
                                {this.state.shot.user.is_following?
                                <button className="btn green-btn m-fuser" onClick={this.followUser}>
                                    < FaCheckDouble /> Following</button>
                                :
                                <button className="btn m-fuser" onClick={this.followUser}>< FaPlus /> Follow</button>
                                }
                                
                            </span>
                            }
                            
                        </section>
                        {/* Modal about uploaded image */}
                        <section className={this.state.showSideView?"modal-about-img hide": "modal-about-img"} id="modal-about-img">
                            <span className="m-display-name">{this.state.shot.portfolio_name}</span>
                            <p className="m-img-content">
                                {EditorSpan(JSONToEditState(JSON.parse(this.state.shot.description)))}
                            </p>
                        </section>
                        {/* Modal likes, comments */}
                        <section className={this.state.showSideView?"modal-reviews hide": "modal-reviews"}>
                            <div className="m-likes">
                                <ModalLikes
                                    doLike={this.doLike}
                                    doUnLike={this.doUnLike}
                                    isLiked={this.state.shot.is_liked}
                                    isSaved={this.state.shot.is_saved}
                                    savePost={this.savePost}
                                    responsecounts={this.state.shot.interactions}
                                    hideCommentBtn={true}
                                    displaySideView={this.displaySideView}
                                    post_id={this.state.shot.id}
                                    isAuth={this.state.isAuth}
                                    currLocation={currLocation}
                                    copyLink={this.getPortFolioLink}
                                />

                            </div>
                            <div className="m-comments">
                                <ModalComments comments_enable={this.state.shot.interactions.comments_enable} post_id={this.state.shot.id} displaySideView={this.displaySideView} 
                                isAuth={this.state.isAuth} 
                                currLocation={currLocation} />
                            </div>

                        </section>

                    </div>

                </div>

                {this.state.showSideView?
                <div className={this.state.sideBarFullScreen?"form-side-bar-view side-bar-view-active full-width": "form-side-bar-view side-bar-view-active"}>
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent}
                    sideBarHead={true} altHeadText={this.state.altHeadText}
                    searchBarRequired={false} onClick={this.sidebarEmptyClick}/>
                </div>
                :
                <div className="form-side-bar-view"></div>
                }
            </React.Fragment>
        )
    }
}



export class ImageSlider extends Component{
    state={
        // slider count management
        selectedContent : null,
        currIndex : 0,
        deletePopup: false,
        deleteMethod: null
    }

    componentDidMount(){
        
        let selectedContent = this.props.attachments[0];
        let currIndex = 0
        this.props.attachments.map((ele, index)=> {
            if(ele.id===this.props.selected_shot_id){
                    selectedContent = ele;
                    currIndex = index
                }
                return ele
            })
        this.setState({selectedContent: selectedContent, currIndex:currIndex})
    }

    iterifyArr = (arr) => {
        let cur = this.state.currIndex;
        arr.next = (function () { return (++cur >= this.length) ? false : this[cur]; });
        arr.prev = (function () { return (--cur < 0) ? false : this[cur]; });
        return arr;
    }

    getNextShot =() =>{
        if (this.state.currIndex >= this.props.attachments.length-1){
            return 
        }
        let content = this.props.attachments.next();
        if (!content){
            return
        }
        this.setState({ 
            selectedContent: content,
            currIndex : this.state.currIndex + 1,
        })

    }

    getPrevShot =() =>{
        if (!this.state.currIndex> 0){
            return
        }
        let content = this.props.attachments.prev();
        if (!content){
            return
        }
        this.setState({ 
            selectedContent: content,
            currIndex : this.state.currIndex - 1,
        })

    }

    activateDeletePopup = (callbackMethod=null) =>{
        this.setState({
            deletePopup: !this.state.deletePopup,
            deleteMethod: callbackMethod,
        })
    }

    updateSelectedContentOnDelete = () =>{
        if(this.state.currIndex>0 && this.props.attachments.length -1 > 0){
            this.getPrevShot() 
        }
        else if(this.state.currIndex===0 && this.props.attachments.length -1 > 0){
            this.getNextShot()
        }
    }

    deleteShot = () =>{
        this.props.deleteShot(this.state.selectedContent.id)
        this.updateSelectedContentOnDelete()
        this.setState({
            deletePopup: false,
            deleteMethod: null

        })
    }
    deletePortfolio = () =>{
        this.props.deletePortfolio()
        this.updateSelectedContentOnDelete()
        this.setState({
            deletePopup: false,
            deleteMethod: null
        })
    }

    render(){

        if(!this.state.selectedContent){
            return(<div className="img-preview"><OwlLoader /></div>)
        }
        if (this.props.attachments.length > 1){
            this.iterifyArr(this.props.attachments)
        }
        return(
            <React.Fragment>
                {this.props.attachments.length> 1?
                    <div className="image-overlay">
                        <AiFillLeftCircle  className ="slide-btn" onClick={this.getPrevShot}/>
                        <div className="slide-middle-view"></div>
                        <AiFillRightCircle className ="slide-btn" onClick={this.getNextShot}/>
                        <div className="attachment-counter">{this.state.currIndex + 1}/{this.props.attachments.length}</div>
                        {this.props.showUser? <UserLogoShared user={this.props.showUser}/>: ""}
                        {this.props.pricingContainer?
                            this.props.pricingContainer.hasOwnProperty(this.state.currIndex + 1)?
                                <div className="price-counter"><span className="rupee-sym">&#8377;</span> {this.props.pricingContainer[this.state.currIndex + 1]}</div>
                                :
                                ""
                            :
                            ""
                        }
                    </div>
                    :
                    ""
                }
                <div className="img-preview">
                    <img alt="No Preview Available" className="m-shot-img" src={this.state.selectedContent.content}></img>
                    <div className="background-decor">
                        <div className="decor-overlay"></div>
                        <img alt="" className="m-shot-background-cover" src={this.state.selectedContent.content}></img>

                    </div>
                </div>
                {this.props.actionBtn?
                    
                    <div className="btn-space">
                        {this.props.addShot?
                            <div className="btn">
                                <span className="add-shot-text">Add Shot</span>
                                <input type="file" className="add-shot-input" onChange={this.props.addShot} />
                            </div>
                            :
                            ""
                        }
                        {this.props.deleteShot?
                        <button className="btn" onClick={this.activateDeletePopup.bind(this, this.deleteShot)}>Remove Shot</button>
                        :
                        ""
                        }
                        {this.props.deletePortfolio?
                        <button className="btn" onClick={this.activateDeletePopup.bind(this, this.deletePortfolio)}>Remove Portfolio</button>
                        :
                        ""
                        }
                        
                    </div>
                    :
                    ""
                }
                {this.state.deletePopup?
                <div className="user-input-popup-container">
                    <div className="user-input-popup">
                        <span>Are you sure to delete shot?</span>
                        <div className="pop-up-action">
                            <span className="pop-up-option-opt" onClick={this.state.deleteMethod}>Yes</span>
                            <span className="pop-up-option-opt" onClick={this.activateDeletePopup}>No</span>
                        </div>
                    </div>

                </div>
                :
                ""

                }
                
            </React.Fragment>
        )
    }
}


export const UserLogoShared = ({user}) =>{
    return(
        <div className="attachment-user-identity"><UserLogoWithUserName key={user.username} data={user}/></div>
    )
}

export default ShotModalView;