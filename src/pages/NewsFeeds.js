import React, { Component } from 'react';
import '../assets/css/newsfeeds.css';
import w1 from "../assets/images/wedding1.jpg";
import {TiEdit} from "react-icons/ti";
import { FaCameraRetro } from 'react-icons/fa';

export class NewsFeeds extends Component {
    render() {
        return (
            <div className="nf-container">
                <div className="nf-user-menu">
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

                    </div>
                </div>
                <div className="nf-feeds"></div>
                <div className="nf-rest"></div>
                
            </div>
        )
    }
}

export default NewsFeeds
