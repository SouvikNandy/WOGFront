import React, { Component } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane , FaCheckCircle} from "react-icons/fa";
import { AiFillCloseCircle } from 'react-icons/ai';
// import { AiOutlineHome, AiOutlineSearch, AiOutlineBell, AiOutlineBulb } from "react-icons/ai";
import SearchHead from '../components/SearchHead';
import Subnav from '../components/Subnav';
import UserAbout from '../components/UserAbout';
import Shot from '../components/Shot';
import Portfolio from '../components/Portfolio';
import AddPost from '../components/AddPost';
import Footer from '../components/Footer';
import {FollowUserCube} from '../components/UserView';


// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";




export default class Profile extends Component {
    state = {
        subNavList:[
            {"key": "sm-1", "title": "Shots", "count": 100, "isActive":true},
            {"key": "sm-2", "title": "Portfolios", "count": 100, "isActive":false},
            {"key": "sm-3", "title": "Tags", "count": 100, "isActive":false},
            {"key": "sm-4", "title": "Followers", "count": 100, "isActive":false},
            {"key": "sm-5", "title": "Following", "count": 100, "isActive":false},
            {"key": "sm-6", "title": "About", "isActive":false},
        ],
        tagNavOptions:[
            {key: "tn-1", "title": "Approved", "count": 100, "isActive": true},
            {key: "tn-2", "title": "Requests", "count": 10, "isActive": false}
        ],
        userShot : [
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}
        ],
        userPortFolio :[
            {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1]}, {id: 2, name:"p2", shot: [w1]}, {id: 3, name:"p3", shot: [w1, pl2, w1, pl2, pl2, w1]}, 
            {id: 4, name:"p4", shot: [w1, pl2, w1]}, {id: 5, name:"p5", shot: [w1, pl2, w1, pl2, pl2, w1]}, {id: 6, name:"p6", shot: [w1]}, 
            {id: 7, name:"p7", shot: [w1]}, {id: 8, name:"p8", shot: [w1, pl2, w1, pl2 ]}, {id: 9, name:"p9", shot: [w1, pl2, w1, pl2, pl2, w1]}, 
            {id: 10, name:"p10", shot: [w1, pl2, w1, pl2, pl2, w1]}
        ],
        userTag:{
            approved : [
                {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
                {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
                {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
                {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
                {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}
            ],
            requests: [
                {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
                {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
                {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
                {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
                {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}
            ]
        },
        userFollower:[
            {"id": 1, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer"},
            {"id": 2, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer"}
        ],
        userFollowing:[
            {"id": 1, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer"},
            {"id": 2, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer"}
        ],
        userAbout:{
            // profile top
            "name": "Jane Doe",
            "username": "janedoe",
            "deisgnantion": "photographer",
            "profile_pic": pl2,
            "cover_pic": w1,

            // about
            "joined": "Feb 15, 2020",
            "bio": "A digital agency for the modern world. We challenge core assumptions, unpick legacy behaviors, and streamline complex processes. Contact us at info@bb.agency",
            "skills": ["photography", "dashboard", "development", "web design"],
            "hometown": "Kolkata, India",
            "birthday": "1 January, 1990",
            // team
            "teams" : [w1, pl2, w1, pl2]
            
        }
    }
    
    selectSubMenu = (key) =>{
        // select a submenu
        this.setState({
            subNavList: this.state.subNavList.map(item=>{
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

    getCompomentData = () =>{
        let resultList = [];
        let resultBlock = ''
        resultBlock = this.state.subNavList.map((item, index) => {
            if(item.title === "Shots" && item.isActive === true){
                // SHOTS
                this.state.userShot.map(ele => 
                        {resultList.push(<Shot key={ele.id} id={ele} onlyShot={true} data={ele} currLocation={this.props.location} />)
                        return ele
                    })
                return(
                    <div key={item.title} className="profile-shots">
                        {resultList}
                        <AddPost />
                    </div>
                )
            }
            else if (item.title === "Portfolios" && item.isActive === true){
                // PORTFOLIOS
                this.state.userPortFolio.map(ele => 
                    {resultList.push(<Portfolio key={ele.id} data={ele} currLocation={this.props.location}  />)
                    return ele
                })
                return(
                    <div key={item.title} className="profile-portfolio-grid">
                        {resultList}
                        <AddPost />
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

                if (getSelectedTab === "approved"){
                    this.state.userTag[getSelectedTab].map(ele => 
                        {resultList.push(<Shot key={ele.id} id={ele} data={ele} currLocation={this.props.location} />)
                        return ele
                    })

                }
                else{
                    this.state.userTag[getSelectedTab].map(ele => 
                        {resultList.push(
                            <div>
                                <div className="tag-decision">
                                    <FaCheckCircle className="tag-decision-btn"/>
                                    <AiFillCloseCircle className="tag-decision-btn" />
                                </div>
                                <Shot key={ele.id} id={ele} data={ele} currLocation={this.props.location} />
                            </div>
                        
                        )
                        return ele
                    })

                }

                
                return(
                    <React.Fragment key={item.title}>
                        <div className="profile-tags-selector">
                            <Subnav subNavList={this.state.tagNavOptions} selectSubMenu={this.selectTagNavMenu} />
                        </div>
                        <div className="profile-portfolio-grid">
                            {resultList}
                        </div>

                    </React.Fragment>
                )
                
            }
            else if (item.title === "Followers" && item.isActive === true){
                // Followers
                this.state.userFollower.map(ele => 
                    {resultList.push(<FollowUserCube key={ele.id} data={ele} isFollowing={false}/>)
                    return ele
                })
                return (
                <div key={item.title} className="profile-portfolio-grid">
                        {resultList}
                </div>
                )
            }
            else if (item.title === "Following" && item.isActive === true){
                this.state.userFollowing.map(ele => 
                    {resultList.push(<FollowUserCube key={ele.id} data={ele} isFollowing={true}/>)
                    return ele
                })
                return (
                    <div key={item.title} className="profile-portfolio-grid">
                            {resultList}
                    </div>
                    )
            }

            else if (item.title === "About" && item.isActive === true){
                // USER ABOUT
                return (<UserAbout key={item.title} data={this.state.userAbout}/>)
            }
            return <React.Fragment key={"default "+ index}></React.Fragment>
        })
        return resultBlock
    }

    render() {
        let resultBlock = this.getCompomentData()
        return (
            <React.Fragment>
                <SearchHead />
                {/* profile top section */}
                <ProfileHead data={this.state.userAbout}/>
                <Subnav subNavList={this.state.subNavList} selectSubMenu={this.selectSubMenu} />
                {/* result Component */}
                {resultBlock}
                <Footer />
            </React.Fragment>
        )
    }
}


function ProfileHead(props) {
    let data = props.data
    return (
        <React.Fragment>
            <div className="profile-top">
                <div className="p-cover">
                    <img className="p-cover-img" src={data.cover_pic} alt="" />
                    <div className="p-user">
                        <img className="p-user-img" src={data.profile_pic} alt="" />
                        <span className="p-display-name">{data.name}<br />
                            <span className="p-adj-username">@{data.username}</span><br />
                            <span className="p-adj">{data.deisgnantion}</span><br />
                            <button className="btn m-fuser">< FaPlus /> Follow</button>
                            <button className="btn m-fuser">< FaPaperPlane /> Message</button>
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
