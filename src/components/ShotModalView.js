import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import '../assets/css/shotmodalview.css';

import { FaPlus } from "react-icons/fa";

// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import ModalLikes from './ModalLikes';
import ModalComments from './ModalComments';
import GoBack from "../components/GoBack";
import { UserFlat } from './UserView';


let sampleShot = {
    "id": 2,
    "user": {
        "name": "John Doe",
        "username": "1amSid",
        "profileimg": w1,
        "designation": "Creative Director",
    },
    "img": w1,
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
        {"id": 1, "username": "user1", "profile_pic": w1},
        {"id": 2, "username": "user1", "profile_pic": w1},
        {"id": 3, "username": "user1", "profile_pic": w1},
        {"id": 4, "username": "user1", "profile_pic": w1},
        {"id": 5, "username": "user1", "profile_pic": w1},
        {"id": 6, "username": "user1", "profile_pic": w1},
    ]
}


export class ShotModalView extends Component {
    state = {
        shot: sampleShot
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

    getUploadedDate = (secondsVal) =>{
        let dt = new Date(0);
        dt.setUTCSeconds(secondsVal);
        return dt.toDateString()
    }
    
    render() {

        let maxCount = window.innerWidth > 700? 3: 2;
        console.log("innerWidth", window.innerWidth, window.innerWidth > 700);

        let tagList = [];
        if (this.state.shot.tags.length > maxCount){
            let tagUsers =  this.state.shot.tags
            let remainingTagsCount = tagUsers.length - maxCount
            for(let i=0; i<maxCount; i++){
                tagList.push(<span key={tagUsers[i].id}><img className="tag-img" src={tagUsers[i].profile_pic} alt={tagUsers[i].username}/></span>)
            }
            tagList.push(<span className="tag-img-count">+{remainingTagsCount}</span>)
        }
        
        else{
            this.state.shot.tags.map(ele => {
                tagList.push(<span key={ele.id}><img className="tag-img" src={ele.profile_pic} alt={ele.username}/></span>)
                return ele
            })
        }
        

        tagList.push(<button className="btn-anc review-tags">Review all tags</button>)


        return (
            <React.Fragment>
                <div className="bg-modal">
                    <div className="modal-content-grid">
                        {/* Modal Image */}
                        <section className="modal-imgbox">
                            <div className="m-options fade-down">
                                <div className="m-options-menu">
                                        <GoBack activeIcon={true} />
                                </div>
                            </div>
                            <img alt={this.state.shot.user.profileimg} className="m-shot-img" src={this.state.shot.user.profileimg}></img>
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
                        <section className="modal-user">
                            <span className="m-attribution-user">
                                <span className="m-user-preview">
                                    <UserFlat />
                                </span>
                            </span>
                            <span className="m-follow">
                                <button className="btn m-fuser">< FaPlus /> Follow</button>
                            </span>
                        </section>
                        {/* Modal about uploaded image */}
                        <section className="modal-about-img" id="modal-about-img">
                            <span className="m-display-name">{this.state.shot.user.name}</span>
                            <p className="m-img-content">
                                {this.state.shot.description}
                            </p>
                        </section>
                        {/* Modal likes, comments */}
                        <section className="modal-reviews">
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
            </React.Fragment>
        )
    }
}







export default ShotModalView;
// export default withRouter(ShotModalView);