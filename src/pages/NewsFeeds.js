import React, { Component } from 'react';
import '../assets/css/newsfeeds.css';
import w1 from "../assets/images/wedding1.jpg";
import {TiEdit} from "react-icons/ti";
import { FaCameraRetro } from 'react-icons/fa';
import {BsClockHistory, BsBookmarks} from 'react-icons/bs';
import {AiOutlineUsergroupAdd, AiOutlineStar, AiOutlinePoweroff} from 'react-icons/ai';
import {FiUnlock, FiSettings} from 'react-icons/fi';

export class NewsFeeds extends Component {
    render() {
        return (
            <div className="nf-container">
                <div className="nf-user-menu">
                    <div className="nf-user-menu-overlay"></div>
                    <div className="nf-user-edit">
                        <div className="nf-user-img">
                            <img className="cube-user-img " src={w1} alt=""/>
                            <span className="edit-pic">
                                <FaCameraRetro  className="cam-icon"/>
                            </span>
                        </div>
                        
                        <span className="m-display-name">
                            Full Name
                            <span className="m-adj">@username</span>
                            <span className="m-adj">designation</span>
                        </span>
                        <button className="btn edit-btn"><TiEdit  className="ico" />Edit Profile</button>

                    </div>
                    <div className="nf-user-menulist">
                        <div className="nf-upper-tokens">
                            <div className="nf-menu-tokens">
                                <BsClockHistory className="ico" />
                                <span>Your Activities</span>
                            </div>
                            <div className="nf-menu-tokens">
                                <AiOutlineUsergroupAdd className="ico" />
                                <span>Discover People</span>
                            </div>
                            <div className="nf-menu-tokens">
                                <AiOutlineStar className="ico" />
                                <span>Ratings & Reviews</span>
                            </div>
                            <div className="nf-menu-tokens">
                                <BsBookmarks className="ico" />
                                <span>Saved</span>
                            </div>

                        </div>
                        <div className="nf-lower-tokens">
                            <div className="nf-menu-tokens">
                                <FiUnlock className="ico" />
                                <span>Privacy</span>
                            </div>
                            <div className="nf-menu-tokens">
                                <FiSettings className="ico" />
                                <span>Settings</span>
                            </div>
                            <div className="nf-menu-tokens">
                                <AiOutlinePoweroff className="ico" />
                                <span>Log Out</span>
                            </div>

                        </div>
                        


                    </div>
                </div>
                <div className="nf-feeds"></div>
                <div className="nf-rest"></div>
                
            </div>
        )
    }
}

export default NewsFeeds
