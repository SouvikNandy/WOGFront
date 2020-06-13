import React, { Component } from 'react';
import '../assets/css/profile.css';
import { FaPlus, FaPaperPlane } from "react-icons/fa";
// import { AiOutlineHome, AiOutlineSearch, AiOutlineBell, AiOutlineBulb } from "react-icons/ai";
import SearchHead from '../components/SearchHead';
import Subnav from '../components/Subnav';
import UserAbout from '../components/UserAbout';
import Shot from '../components/Shot';
import Footer from '../components/Footer';


// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";




export default class Profile extends Component {
    render() {
        let shotList = [];
        for (let i = 0; i < 32; i++) {
            shotList.push(<Shot key={i} id={i} onlyShot={true} currLocation={this.props.location} />)
        }

        return (
            <React.Fragment>
                <SearchHead />
                {/* profile top section */}
                <ProfileHead />
                <Subnav />
                {/* <UserAbout /> */}
                <div className="profile-shots">
                    {shotList}
                </div>

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