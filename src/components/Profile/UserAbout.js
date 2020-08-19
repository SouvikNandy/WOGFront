import React from 'react'
import '../../assets/css/profile.css';
import {FiGlobe} from 'react-icons/fi';
import {
    FaMapMarkerAlt, FaBirthdayCake, FaIdCard,
    FaFacebookSquare, FaInstagram, FaYoutube, FaPinterest
} from 'react-icons/fa';
import { msToDateTime } from '../../utility/Utility';

export default function UserAbout(props) {
    let data = props.data
    let skillList = [];
    let teamList = [];
    if(data.profile_data && data.profile_data.skillList && data.profile_data.skillList.length> 0){
        data.profile_data.skills.map((ele, index) =>{
            skillList.push(<span key={"sk-"+ index} className="item-span">{ele}</span>);
            return ele
        })

    }
    else{
        skillList.push(<span>Not updated by user</span>)
    }
    
    if(data.profile_data && data.profile_data.teams && data.profile_data.teams.length> 0){
        data.profile_data.teams.map((ele, index) =>{
            teamList.push(<img  key={"tl-"+ index} className="tag-img" src={ele} alt=""></img>);
            return ele
        })
    }
    else{
        teamList.push(<span>Not updated by user</span>)
    }
    
    return (
        <React.Fragment>
            <section className="user-about">
                <div className="u-about-container">
                    <div className="u-bio u-box">
                        <div className="u-content">
                            <h4>Bio</h4>
                            <div className="u-content-datadiv">
                                <p>{data.profile_data && data.profile_data.bio? data.profile_data.bio: "Not updated by user"}</p>
                            </div>
                            
                        </div>
                    </div>
                    <div className="u-skills u-box">
                        <div className="u-content">
                            <h4>Skills</h4>
                            <div className="u-content-datadiv">
                                {skillList}
                            </div>
                            
                        </div>
                    </div>
                    <div className="u-des u-box">
                        <div className="u-content">
                            <ul className="u-content-datadiv">
                                {data.profile_data && data.profile_data.hometown? <li><FaMapMarkerAlt  className="icons"/> {data.profile_data.hometown}</li>: ""}
                                {data.profile_data && data.profile_data.currentcity? <li><FaMapMarkerAlt className="icons" /> {data.profile_data.currentcity}</li>: ""}
                                {data.profile_data && data.profile_data.birthday? <li><FaBirthdayCake  className="icons" /> {data.profile_data.birthday}</li>: ""}
                                <li><FaIdCard className="icons" /> Member since {msToDateTime(data.created_at)}</li>
                            </ul>

                        </div>
                    </div>
                    <div className="u-team u-box">
                        <div className="u-content">
                            <h4>Teams</h4>
                            <div className="u-content-datadiv">
                                {teamList}
                            </div>
                        </div>
                    </div>
                    <div className="u-social u-box">
                        <div className="u-content">
                            <h4>Social Handles</h4>
                            
                                {data.profile_data && data.profile_data.social && data.profile_data.social["web"]? 
                                    <div className="u-link">
                                        <FiGlobe className="icons" />
                                        <span>{data.profile_data.social["web"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.profile_data && data.profile_data.social && data.profile_data.social["facebook"]? 
                                    <div className="u-link">
                                        <FaFacebookSquare className="icons" />
                                        <span>{data.profile_data.social["facebook"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.profile_data && data.profile_data.social && data.profile_data.social["instagram"]? 
                                    <div className="u-link">
                                        <FaInstagram className="icons" />
                                        <span>{data.profile_data.social["instagram"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.profile_data && data.profile_data.social && data.profile_data.social["youtube"]? 
                                    <div className="u-link">
                                        <FaYoutube className="icons" />
                                        <span>{data.profile_data.social["youtube"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.profile_data && data.profile_data.social && data.profile_data.social["pinterest"]? 
                                    <div className="u-link">
                                        <FaPinterest className="icons" />
                                        <span>{data.profile_data.social["pinterest"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                            
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}
