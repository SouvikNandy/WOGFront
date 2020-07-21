import React, { Component } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane , FaCheckCircle} from "react-icons/fa";
import { AiFillCloseCircle } from 'react-icons/ai';
// import { AiOutlineHome, AiOutlineSearch, AiOutlineBell, AiOutlineBulb } from "react-icons/ai";
// import SearchHead from '../components/SearchHead';
import Subnav from '../components/Subnav';
import UserAbout from '../components/UserAbout';
import {Shot, ShotPalette} from '../components/Shot';
import Portfolio from '../components/Portfolio';
import AddPost from '../components/AddPost';
import Footer from '../components/Footer';
import {FollowUserCube} from '../components/UserView';
import {UserNavBar} from "../components/Navbar";
import DummyShots from '../components/DummyShots';
import {generateId, isSelfUser} from '../utility/Utility.js';


// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";



export default class Profile extends Component {
    state = {
        subNavList:[
            {"key": "sm-1", "title": "Shots", "count": true, "isActive":true},
            {"key": "sm-2", "title": "Portfolios", "count": true, "isActive":false},
            {"key": "sm-3", "title": "Tags", "count": true, "isActive":false},
            {"key": "sm-4", "title": "Followers", "count": true, "isActive":false},
            {"key": "sm-5", "title": "Following", "count": true, "isActive":false},
            {"key": "sm-6", "title": "Saved", "count": true, "isActive":false},
            {"key": "sm-7", "title": "About", "isActive":false},
            {"key": "sm-8", "title": "Reviews", "count": true, "isActive":false},
            
        ],
        tagNavOptions:[
            {key: "tn-1", "title": "Approved", "count": true, "isActive": true},
            {key: "tn-2", "title": "Requests", "count": true, "isActive": false}
        ],
        userShot : [
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: pl2}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1}, 

        ],
        userPortFolio :[
            {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1], likes: 100, comments: 100, shares:0,}, 
            {id: 2, name:"p2", shot: [w1], likes: 100, comments: 100, shares:0,}, 
            {id: 3, name:"p4", shot: [w1, pl2, w1], likes: 100, comments: 100, shares:0,}, 
        ],
        userTag:{
            approved : [
                {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: pl2, is_liked: false}, 
                {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1, is_liked: false}, 
            ],
            requests: [
                {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: pl2, is_liked: false}, 
                {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1, is_liked: false}, 
            ]
        },
        userFollower:[
            {"id": 1, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer", "isFollowing": false},
            {"id": 2, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer", "isFollowing": false}
        ],
        userFollowing:[
            {"id": 11, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer", "isFollowing": true},
            {"id": 12, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer", "isFollowing": true}
        ],
        userAbout:{
            // profile top
            "name": "Jane Doe",
            "username": "janedoe",
            "deisgnantion": "photographer",
            "profile_pic": pl2,
            "cover_pic": w1,
            "isFollowing": false,

            // about
            "joined": "Feb 15, 2020",
            "bio": "A digital agency for the modern world. We challenge core assumptions, unpick legacy behaviors, and streamline complex processes. Contact us at info@bb.agency",
            "skills": ["photography", "dashboard", "development", "web design"],
            "hometown": "Kolkata, India",
            "birthday": "1 January, 1990",
            // team
            "teams" : [w1, pl2, w1, pl2]
            
        },
        userSaved: [],
    }

    getMenuCount = (key) =>{
        switch (key) {
            case "Shots":
                return this.state.userShot.length;
            case "Portfolios":
                return this.state.userPortFolio.length;
            case "Tags":
                // default is approved tag values
                return this.state.userTag.approved.length;
            case "Followers":
                return this.state.userFollower.length;
            case "Following":
                return this.state.userFollowing.length;
            case "Approved":
                // approved tags
                return this.state.userTag.approved.length;
            case "Requests":
                // requested tags
                return this.state.userTag.requests.length;
            
            default:
                return 0
    
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
        this.setState({
            userPortFolio: this.state.userPortFolio.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = true;
                    ele.likes++;
                }
                return ele
            })
        })

    }
    unLikePortfolio = (idx) =>{
        this.setState({
            userPortFolio: this.state.userPortFolio.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = false;
                    ele.likes--;
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

    saveShot = () =>{
        
    }

    padDummyShot = (resultList, len, maxlen=5) =>{
        if (len < maxlen){
            for(let i =0; i< maxlen - len ; i++){
                resultList.push(<DummyShots  key={"DS"+ i }/>)
            }
        }
        return resultList
    }

    getCompomentData = () =>{
        let resultList = [];
        let resultBlock = '';
        resultBlock = this.state.subNavList.map((item, index) => {
            if(item.title === "Shots" && item.isActive === true){
                // SHOTS
                this.state.userShot.map(ele => 
                        {resultList.push(<Shot key={ele.id} id={ele} onlyShot={true} data={ele} currLocation={this.props.location} />)
                        return ele
                    })
                resultList = this.padDummyShot(resultList, this.state.userShot.length, 5)
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
                    {resultList.push(<Portfolio key={ele.id} data={ele} currLocation={this.props.location} 
                        likePortfolio={this.likePortfolio} unLikePortfolio={this.unLikePortfolio} />)
                    return ele
                })
                resultList = this.padDummyShot(resultList, this.state.userPortFolio.length, 5)
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
                    resultList = <ShotPalette shotData={this.state.userTag[getSelectedTab]} currLocation={this.props.location}/>
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

                
                return(
                    <React.Fragment key={item.title}>
                        <div className="profile-tags-selector">
                            <Subnav subNavList={this.state.tagNavOptions} selectSubMenu={this.selectTagNavMenu} getMenuCount={this.getMenuCount}/>
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
                    {resultList.push(<FollowUserCube key={ele.id} data={ele} isFollowing={ele.isFollowing} 
                        startFollowing={this.startFollowing} stopFollowing={this.stopFollowing} />)
                    return ele
                })
                resultList = this.padDummyShot(resultList, this.state.userFollower.length, 5)
                return (
                <div key={item.title} className="profile-portfolio-grid">
                        {resultList}
                </div>
                )
            }
            else if (item.title === "Following" && item.isActive === true){
                this.state.userFollowing.map(ele => 
                    {resultList.push(<FollowUserCube key={ele.id} data={ele} isFollowing={ele.isFollowing} 
                        stopFollowing={this.stopFollowing} />)
                    return ele
                })
                resultList = this.padDummyShot(resultList, this.state.userFollowing.length, 5)
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
                {/* <SearchHead /> */}
                <UserNavBar />
                {/* profile top section */}
                <ProfileHead data={this.state.userAbout}/>
                <Subnav subNavList={this.state.subNavList} selectSubMenu={this.selectSubMenu}  getMenuCount={this.getMenuCount}/>
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
                            <button className="btn m-fuser">< FaPlus className="ico"/> Follow</button>
                            <button className="btn m-fuser">< FaPaperPlane className="ico"/> Message</button>
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
