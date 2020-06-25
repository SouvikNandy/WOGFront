import React, { Component } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane } from "react-icons/fa";
// import { AiOutlineHome, AiOutlineSearch, AiOutlineBell, AiOutlineBulb } from "react-icons/ai";
import SearchHead from '../components/SearchHead';
import Subnav from '../components/Subnav';
import UserAbout from '../components/UserAbout';
import Shot from '../components/Shot';
import Portfolio from '../components/Portfolio';
import AddPost from '../components/AddPost';
import Footer from '../components/Footer';


// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";




export default class Profile extends Component {
    state = {
        subNavList:[
            {"key": 1, "title": "Shots", "count": 100, "isActive":true},
            {"key": 2, "title": "Portfolios", "count": 100, "isActive":false},
            {"key": 3, "title": "Tags", "count": 100, "isActive":false},
            {"key": 4, "title": "Followers", "count": 100, "isActive":false},
            {"key": 5, "title": "Following", "count": 100, "isActive":false},
            {"key": 6, "title": "About", "isActive":false},
        ]
    }
    
    selectSubMenu = (key) =>{
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

    render() {
        let shotList = [];
        for (let i = 0; i < 32; i++) {
            shotList.push(<Shot key={"s"+i} id={i} onlyShot={true} currLocation={this.props.location} />)
        }
        let portfolioList = [];
        for (let i = 0; i < 10; i++) {
            portfolioList.push(<Portfolio key={"p4"+ i} contained={4} />)
            portfolioList.push(<Portfolio key={"p1"+ i} contained={1} />)
            portfolioList.push(<Portfolio key={"p10"+ i} contained={10} />)
        }

        return (
            <React.Fragment>
                <SearchHead />
                {/* profile top section */}
                <ProfileHead />
                <Subnav subNavList={this.state.subNavList} selectSubMenu={this.selectSubMenu} />

                {this.state.subNavList.map((item, index) => {
                    if(item.title === "Shots" && item.isActive === true){
                        // SHOT LIST
                        return(
                            <div key={item.title} className="profile-shots">
                                {shotList}
                                <AddPost />
                            </div>
                        )
                    }
                    else if (item.title === "Portfolios" && item.isActive === true){
                        // PORTFOLIOS
                        return(
                            <div key={item.title} className="profile-portfolio-grid">
                                {portfolioList}
                                <AddPost />
                            </div>
                        )
                    }
                    else if (item.title === "Tags" && item.isActive === true){
                        // TAG LIST
                        return(
                            <div key={item.title} className="profile-shots">
                                {shotList}
                            </div>
                        )
                        
                    }
                    else if (item.title === "Followers" && item.isActive === true){
                        return (<React.Fragment key={item.title}></React.Fragment>)
                    }
                    else if (item.title === "Following" && item.isActive === true){
                        return (<React.Fragment key={item.title}></React.Fragment>)
                    }

                    else if (item.title === "About" && item.isActive === true){
                        // USER ABOUT
                        return (<UserAbout key={item.title}/>)
                    }
                    return <React.Fragment key={index}></React.Fragment>
                })}
                <Footer />
            </React.Fragment>
        )
    }
}


function ProfileHead() {
    return (
        <React.Fragment>
            <div className="profile-top">
                <div className="p-cover">
                    <img className="p-cover-img" src={w1} alt="" />
                    <div className="p-user">
                        <img className="p-user-img" src={pl2} alt="" />
                        <span className="p-display-name">Souvik Nandy<br />
                            <span className="p-adj-username">@1amSid</span><br />
                            <span className="p-adj">Photographer</span><br />
                            <button className="btn m-fuser">< FaPlus /> Follow</button>
                            <button className="btn m-fuser">< FaPaperPlane /> Message</button>
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}