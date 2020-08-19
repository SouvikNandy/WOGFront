import React, { Component } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane , FaCheckCircle, FaCameraRetro, FaUserCircle} from "react-icons/fa";
import { AiFillCloseCircle } from 'react-icons/ai';
// import { AiOutlineHome, AiOutlineSearch, AiOutlineBell, AiOutlineBulb } from "react-icons/ai";
import SearchHead from '../components/Search/SearchHead';
import Subnav from '../components/Navbar/Subnav';
import UserAbout from '../components/Profile/UserAbout';
import {Shot, ShotPalette} from '../components/Post/Shot';
import Portfolio from '../components/Profile/Portfolio';
import AddPost from '../components/Post/AddPost';
import Footer from '../components/Footer';
import {FollowUserCube} from '../components/Profile/UserView';
// import {UserNavBar} from "../components/Navbar";
import DummyShots from '../components/Post/DummyShots';
import {generateId, isSelfUser} from '../utility/Utility.js';
import NoContent from '../components/NoContent';

// Images for shot
// import w1 from "../assets/images/wedding1.jpg";
// import pl2 from "../assets/images/people/2.jpg";
import CommunityReview from '../pages/CommunityReview'
import { UserNavBar } from '../components/Navbar/Navbar';
import { TiEdit } from 'react-icons/ti';
import EditProfile from '../components/Profile/EditProfile';
import ImgCompressor from '../utility/ImgCompressor';
import {defaultCoverPic} from '../utility/userData';
import { retrieveFromStorage } from '../utility/Utility';



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
        userShot : [
            // {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: pl2}, 
            // {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1}, 

        ],
        userPortFolio :[
            // {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1], likes: 100, comments: 100, shares:0,}, 
            // {id: 2, name:"p2", shot: [w1], likes: 100, comments: 100, shares:0,}, 
            // {id: 3, name:"p4", shot: [w1, pl2, w1], likes: 100, comments: 100, shares:0,}, 
        ],
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

        userSaved: [
            // {id: 1, name:"p1", shot: [w1, pl2, w1, pl2, pl2, w1], likes: 100, comments: 100, shares:0,}, 
            // {id: 2, name:"p2", shot: [w1], likes: 100, comments: 100, shares:0,}, 
            // {id: 3, name:"p4", shot: [w1, pl2, w1], likes: 100, comments: 100, shares:0,},
            // {id: 4, name:"p4", shot: [w1, pl2, w1, pl2], likes: 100, comments: 100, shares:0,},
        ],
        isSelf : false,
        editProf: false,
    }

    componentDidMount(){
        let subnav = ''
        let isSelf = false
        if(this.props.isAuthenticated && isSelfUser(this.state.userAbout.username, this.props.match.params.username)){
            subnav = AuthUserNav;
            isSelf = true;
        }
        else{
            subnav = PublicNav;
        }
        let qstr = new URLSearchParams(this.props.location.search);
        let activeTab = qstr.get('active');
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
        this.setState({subNavList: subnav, isSelf: isSelf})
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
            case "Saved":
                return this.state.userSaved.length;
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
    removeFromSaved = (idx) =>{
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

    uploadPicture =(e, imgKey) =>{
        console.log(e.target.files, imgKey)
        ImgCompressor(e, this.addFileToState, imgKey)
    }
    addFileToState = (compressedFile, imgKey) =>{
        let userAbout = this.state.userAbout;
        if (imgKey === "profile_pic"){
            
            userAbout.profile_pic = URL.createObjectURL(compressedFile)
            this.setState({userAbout: userAbout})
        }
        else if(imgKey === "cover_pic"){
            userAbout.cover_pic = URL.createObjectURL(compressedFile)
            this.setState({userAbout: userAbout})
        }
    }

    getCompomentData = () =>{
        let resultList = [];
        let resultBlock = '';
        resultBlock = this.state.subNavList.map((item, index) => {
            if(item.title === "Shots" && item.isActive === true){
                // SHOTS
                if (this.state.userShot.length === 0){
                    let msg = "No shots yet !!!"
                    resultList = this.getNoContentDiv(msg);
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
                else{
                    this.state.userShot.map(ele => 
                        {resultList.push(<Shot key={ele.id} id={ele} onlyShot={true} data={ele} currLocation={this.props.location} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userShot.length, 5)
                    return(
                        <div key={item.title} className="profile-shots">
                            {resultList}
                            {this.state.isSelf?
                            <AddPost />
                            :
                            ""}
                        </div>
                    )
                }
                
            }
            else if (item.title === "Portfolios" && item.isActive === true){
                // PORTFOLIOS
                if (this.state.userPortFolio.length === 0){
                    let msg = "No portfolios have been created !!!"
                    resultList = this.getNoContentDiv(msg)
                }
                else{
                    this.state.userPortFolio.map(ele => 
                        {resultList.push(<Portfolio key={ele.id} data={ele} currLocation={this.props.location} 
                            likePortfolio={this.likePortfolio} unLikePortfolio={this.unLikePortfolio} />)
                        return ele
                    })
                    resultList = this.padDummyShot(resultList, this.state.userPortFolio.length, 5)
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

                if (getSelectedTab === "approved"){
                    if(this.state.userTag[getSelectedTab].length === 0){
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
                <UserNavBar selectedMenu={"profile"} username={this.props.username}/>
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
    let coverpic = data.cover_pic? data.cover_pic: defaultCoverPic();
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
                                {data.profile_pic?
                                    <img className="p-user-img" src={data.profile_pic} alt="" />
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
                        
                        <span className="p-display-name">{data.name}<br />
                            <span className="p-adj-username">@{data.username}</span><br />
                            <span className="p-adj">
                            {(data.profile_data && data.profile_data.designation)? data.profile_data.designation:""}
                                </span><br />
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
