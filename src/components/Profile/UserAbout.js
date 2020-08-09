import React from 'react'
import '../../assets/css/profile.css';
import {FiGlobe} from 'react-icons/fi';
import {
    FaMapMarkerAlt, FaBirthdayCake, FaIdCard,
    FaFacebookSquare, FaInstagram, FaYoutube, FaPinterest
} from 'react-icons/fa';

export default function UserAbout(props) {
    let data = props.data
    let skillList = [];
    let teamList = [];
    data.skills.map((ele, index) =>{
        skillList.push(<span key={"sk-"+ index} className="item-span">{ele}</span>);
        return ele
    })
    data.teams.map((ele, index) =>{
        teamList.push(<img  key={"tl-"+ index} className="tag-img" src={ele} alt=""></img>);
        return ele
    })
    return (
        <React.Fragment>
            <section className="user-about">
                <div className="u-about-container">
                    <div className="u-bio u-box">
                        <div className="u-content">
                            <h4>Bio</h4>
                            <div className="u-content-datadiv">
                                <p>{data.bio}</p>
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
                                {data.hometown? <li><FaMapMarkerAlt  className="icons"/> {data.hometown}</li>: ""}
                                {data.currentcity? <li><FaMapMarkerAlt className="icons" /> {data.currentcity}</li>: ""}
                                {data.birthday? <li><FaBirthdayCake  className="icons" /> {data.birthday}</li>: ""}
                                <li><FaIdCard className="icons" /> Member since {data.joined}</li>
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
                            
                                {data.social_handles["web"]? 
                                    <div className="u-link">
                                        <FiGlobe className="icons" />
                                        <span>{data.social_handles["web"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.social_handles["facebook"]? 
                                    <div className="u-link">
                                        <FaFacebookSquare className="icons" />
                                        <span>{data.social_handles["facebook"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.social_handles["instagram"]? 
                                    <div className="u-link">
                                        <FaInstagram className="icons" />
                                        <span>{data.social_handles["instagram"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.social_handles["youtube"]? 
                                    <div className="u-link">
                                        <FaYoutube className="icons" />
                                        <span>{data.social_handles["youtube"]}</span>
                                    </div>
                                    : 
                                    ""
                                }
                                {data.social_handles["pinterest"]? 
                                    <div className="u-link">
                                        <FaPinterest className="icons" />
                                        <span>{data.social_handles["pinterest"]}</span>
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
