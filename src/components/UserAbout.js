import React from 'react'
import '../assets/css/profile.css';
import {
    FaMapMarkerAlt, FaBirthdayCake, FaIdCard,
    FaFacebookSquare, FaInstagram, FaYoutubeSquare, FaTwitter
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
                            <p>{data.bio}</p>

                        </div>
                    </div>
                    <div className="u-skills u-box">
                        <div className="u-content">
                            <h4>Skills</h4>
                            {skillList}
                        </div>
                    </div>
                    <div className="u-des u-box">
                        <div className="u-content">
                            <ul>
                                <li><FaMapMarkerAlt /> {data.hometown}</li>
                                <li><FaBirthdayCake /> {data.birthday}</li>
                                <li><FaIdCard /> Member since {data.joined}</li>
                            </ul>

                        </div>
                    </div>
                    <div className="u-team u-box">
                        <div className="u-content">
                            <h4>Teams</h4>
                            {teamList}
                            {/* {data.bio} */}
                        </div>
                    </div>
                    <div className="u-social u-box">
                        <div className="u-content">
                            <h4>Social Handles</h4>
                            <button className="btn-anc"><FaFacebookSquare className="icons only-right-m" /></button>
                            <button className="btn-anc"><FaInstagram className="icons" /></button>
                            <button className="btn-anc"><FaYoutubeSquare className="icons" /></button>
                            <button className="btn-anc"><FaTwitter className="icons" /></button>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}
