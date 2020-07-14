import React, { Component } from 'react';
import '../assets/css/shotmodalview.css';

import { FaPlus, FaCheckDouble } from "react-icons/fa";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

import ModalLikes from '../components/ModalLikes';
import ModalComments from '../components/ModalComments';
import GoBack from "../components/GoBack";
import { UserFlat } from '../components/UserView';
import TagUser from '../components/TagUser';
import SideBar from '../components/SideBar';

// import {isSelfUser} from '../utility/Utility'

// Images for shot
import w1 from "../assets/images/wedding1.jpg";

let sampleShot = {
    "id": 2,
    "user": {
        "id": 1,
        "name": "John Doe",
        "username": "1amSid",
        "profile_pic": w1,
        "designation": "Creative Director",
        "is_following": false,
    },
    "uploaded_content": w1,
    "created_at": 1589028744,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisi elit, mattis id facilisis nec, imperdiet eu lorem. Phasellus elit velit, finibus ut quam vitae, auctor egestas lectus. Nunc convallis interdum risus at semper. Pellentesque auctor sollicitudin felis et tincidunt. Sed faucibus vestibulum elit vel hendrerit. Nam eu eros accumsan, fermentum felis at, accumsan libero. Nulla rhoncus, ante ac sagittis aliquam, nibh magna dictum eros, vitae pulvinar nisi urna nec augue. Mauris gravida egestas mauris eget convallis. Aenean pretium pretium odio. Integer malesuada et velit eu euismod. Nam nisl nisl, feugiat quis nisl at, lobortis convallis quam.",
    "responsecounts": {
        "likes": 100,
        "shares": 100,
        "comments": 3
    },
    "is_liked": false,
    "portfolio_name": "Lorem Ipsum",
    "tags": [
        {"id": 1, "name":"First Last", "username": "user1", "profile_pic": w1, "designation": "photographer"},
        {"id": 2, "name":"First Last", "username": "user2", "profile_pic": w1, "designation": "photographer"},
        {"id": 3, "name":"First Last", "username": "user3", "profile_pic": w1, "designation": "photographer"},
        {"id": 4, "name":"First Last", "username": "user4", "profile_pic": w1, "designation": "photographer"},
        {"id": 5, "name":"First Last", "username": "user5", "profile_pic": w1, "designation": "photographer"},
        {"id": 6, "name":"First Last", "username": "user6", "profile_pic": w1, "designation": "photographer"},
        {"id": 7, "name":"First Last", "username": "user7", "profile_pic": w1, "designation": "photographer"},
        {"id": 8, "name":"First Last", "username": "user8", "profile_pic": w1, "designation": "photographer"},
        {"id": 9, "name":"First Last", "username": "user9", "profile_pic": w1, "designation": "photographer"},
        {"id": 10, "name":"First Last", "username": "user10", "profile_pic": w1, "designation": "photographer"},
        {"id": 11, "name":"First Last", "username": "user11", "profile_pic": w1, "designation": "photographer"},
        {"id": 12, "name":"First Last", "username": "user12", "profile_pic": w1, "designation": "photographer"},
        {"id": 13, "name":"First Last", "username": "user13", "profile_pic": w1, "designation": "photographer"},
        {"id": 14, "name":"First Last", "username": "user14", "profile_pic": w1, "designation": "photographer"},
        {"id": 15, "name":"First Last", "username": "user15", "profile_pic": w1, "designation": "photographer"},
        {"id": 16, "name":"First Last", "username": "user16", "profile_pic": w1, "designation": "photographer"},
        {"id": 17, "name":"First Last", "username": "user17", "profile_pic": w1, "designation": "photographer"},
        {"id": 18, "name":"First Last", "username": "user18", "profile_pic": w1, "designation": "photographer"},
        {"id": 19, "name":"First Last", "username": "user19", "profile_pic": w1, "designation": "photographer"},
        {"id": 20, "name":"First Last", "username": "user20", "profile_pic": w1, "designation": "photographer"}
    ]
}


export class ShotModalView extends Component {
    state = {
        shot: sampleShot,

        // sidebar states
        showSideView: false,
        sideViewContent: [],
        sideBarFullScreen: false,

        // slider count management
        currIndex: 0
    }

    doLike = () => {
        // api call to update likes
        // also increase the count
        var shot = { ...this.state.shot };
        shot.is_liked = true;
        shot.responsecounts.likes++;
        this.setState({ shot });
    }

    doUnLike = () => {
        // api call to update likes
        // also decrease the count
        var updatedshot = { ...this.state.shot };
        updatedshot.is_liked = false;
        updatedshot.responsecounts.likes--;
        this.setState({ shot: updatedshot })
    }

    followUser = () =>{
        // follow unfollow user
        let prevShot = this.state.shot;
        prevShot.user.is_following = !prevShot.user.is_following;
        this.setState({
            shot: prevShot
        })
    }

    getUploadedDate = (secondsVal) =>{
        let dt = new Date(0);
        dt.setUTCSeconds(secondsVal);
        return dt.toDateString()
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

    displaySideView = ({content, sureVal}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal
        })

        if(content){
            this.setState({
                sideViewContent: content
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

    getNextShot =() =>{
        if (this.state.currIndex >= this.props.totalShotCount-1){
            return 
        }
        let updatedShot = {...this.state.shot};
        let content = this.props.getNext();
        if (!content){
            return
        }
        updatedShot.uploaded_content = content;
        this.setState({ 
            shot: updatedShot,
            currIndex : this.state.currIndex + 1,
        })

    }

    getPrevShot =() =>{
        if (!this.state.currIndex> 0){
            return
        }

        let updatedShot = {...this.state.shot};
        let content = this.props.getPrev();
        if (!content){
            return
        }
        updatedShot.uploaded_content = content;
        this.setState({ 
            shot: updatedShot,
            currIndex : this.state.currIndex - 1,
        })

    }
    
    render() {
        // console.log("props", this.props);

        // console.log("utility method", isSelfUser({1, this.state.shot.user.id}))

        let maxCount = window.innerWidth > 700? 3: 2;

        let tagList = [];
        let existingList = [];

        // add all members to show
        this.state.shot.tags.map( item =>{
            existingList.push(<TagUser key={item.id} data={item} onRemoveMember={this.onRemoveMember}/>)
            return existingList
                
        })

        if (this.state.shot.tags.length > maxCount){
            let tagUsers =  this.state.shot.tags
            let remainingTagsCount = tagUsers.length - maxCount
            for(let i=0; i<maxCount; i++){
                tagList.push(<span key={tagUsers[i].id}><img className="tag-img" src={tagUsers[i].profile_pic} alt={tagUsers[i].username}/></span>)
            }
            tagList.push(<span key="tag-img-count" className="tag-img-count" 
            onClick={this.displaySideView.bind(this, {content: existingList, sureVal: true})}>+{remainingTagsCount}</span>)
        }
        
        else{
            this.state.shot.tags.map(ele => {
                tagList.push(<span key={ele.id}><img className="tag-img" src={ele.profile_pic} alt={ele.username}/></span>)
                return ele
            })
        }

        tagList.push(
        <button key="review-tags" className="btn-anc review-tags" 
        onClick={this.displaySideView.bind(this, {content: existingList, sureVal: true})}>Review all tags</button>
        )


        return (
            <React.Fragment>
                
                <div className={this.state.showSideView?"bg-modal with-side-width": "bg-modal full-width"}>
                
                    <div className={this.state.showSideView?"modal-content-grid modal-grid-only-img": "modal-content-grid"}>
                        {/* Modal Image */}
                        <section className="modal-imgbox">
                            {this.props.slider?
                            <div className="image-overlay">
                                <AiFillLeftCircle  className ="slide-btn" onClick={this.getPrevShot}/>
                                <div className="slide-middle-view"
                                // onclick event to show full size picture
                                onClick={this.displayFullSizeImagePreview.bind(
                                this, this.getSidebarDisplayImg(this.state.shot.uploaded_content))}
                                ></div>
                                <AiFillRightCircle className ="slide-btn" onClick={this.getNextShot}/>
                            </div>
                            :
                            ""
                            }
                            
                            <div className="m-options fade-down">
                                <div className="m-options-menu">
                                        <GoBack activeIcon={true} clickMethod={this.props.openModalView} />
                                </div>
                            </div>
                            {/* preview image */}
                            <img alt="No Preview Available" className="m-shot-img" 
                            src={this.state.shot.uploaded_content}

                            // onclick event to show full size picture
                            onClick={this.displayFullSizeImagePreview.bind(this, this.getSidebarDisplayImg(this.state.shot.uploaded_content))}
                            ></img>
                            <div className="m-img-attribute fade-up">
                                <span className="p-attr-name">
                                    <span className="m-display-name">
                                        {this.state.shot.portfolio_name}<br />
                                        <span className="m-adj">uploaded on: {this.getUploadedDate(this.state.shot.created_at)} </span>
                                    </span>
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
                                    <UserFlat data={this.state.shot.user}/>
                                </span>
                            </span>
                            <span className="m-follow">
                                {this.state.shot.user.is_following?
                                <button className="btn green-btn m-fuser" onClick={this.followUser}>
                                    < FaCheckDouble /> Following</button>
                                :
                                <button className="btn m-fuser" onClick={this.followUser}>< FaPlus /> Follow</button>
                                }
                                
                            </span>
                        </section>
                        {/* Modal about uploaded image */}
                        <section className={this.state.showSideView?"modal-about-img hide": "modal-about-img"} id="modal-about-img">
                            <span className="m-display-name">{this.state.shot.user.name}</span>
                            <p className="m-img-content">
                                {this.state.shot.description}
                            </p>
                        </section>
                        {/* Modal likes, comments */}
                        <section className={this.state.showSideView?"modal-reviews hide": "modal-reviews"}>
                            <div className="m-likes">
                                <ModalLikes
                                    doLike={this.doLike}
                                    doUnLike={this.doUnLike}
                                    isLiked={this.state.shot.is_liked}
                                    responsecounts={this.state.shot.responsecounts} />

                            </div>
                            <div className="m-comments">
                                <ModalComments post_id={this.state.shot.id} />
                            </div>

                        </section>

                    </div>

                </div>

                {this.state.showSideView?
                <div className={this.state.sideBarFullScreen?"form-side-bar-view side-bar-view-active full-width": "form-side-bar-view side-bar-view-active"}>
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent}
                    sideBarHead={true}
                    searchBarRequired={false} onClick={this.sidebarEmptyClick}/>
                </div>
                :
                <div className="form-side-bar-view"></div>
                }
            </React.Fragment>
        )
    }
}

export default ShotModalView;