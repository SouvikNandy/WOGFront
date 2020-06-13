import React from 'react'
import '../assets/css/profile.css';
import {
    FaMapMarkerAlt, FaBirthdayCake, FaIdCard,
    FaFacebookSquare, FaInstagram, FaYoutubeSquare, FaTwitter
} from 'react-icons/fa';

export default function UserAbout() {
    return (
        <React.Fragment>
            <section className="user-about">
                <div className="u-about-container">
                    <div className="u-bio u-box">
                        <div className="u-content">
                            <h4>Bio</h4>
                            <p>A digital agency for the modern world. We challenge core assumptions, unpick legacy behaviors, and streamline complex processes. Contact us at info@bb.agency</p>

                        </div>
                    </div>
                    <div className="u-skills u-box">
                        <div className="u-content">
                            <h4>Skills</h4>
                            <p> branding
                                dashboard
                                development
                                interaction design
                                mobile
                                ui
                                ux
                            web design</p>
                        </div>
                    </div>
                    <div className="u-des u-box">
                        <div className="u-content">
                            <ul>
                                <li><FaMapMarkerAlt /> Kolkata, India</li>
                                <li><FaBirthdayCake /> 1 January, 1990</li>
                                <li><FaIdCard /> Member since Feb 2015</li>
                            </ul>

                        </div>
                    </div>
                    <div className="u-team u-box">
                        <div className="u-content">
                            <h4>Team</h4>
                            <p>A digital agency for the modern world. We challenge core assumptions, unpick legacy behaviors, and streamline complex processes. Contact us at info@bb.agency</p>
                        </div>
                    </div>
                    <div className="u-social u-box">
                        <div className="u-content">
                            <h4>Social</h4>
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
