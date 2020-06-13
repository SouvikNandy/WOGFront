import React from 'react';
import '../assets/css/landing.css';
import { FaHeart, FaFacebookSquare, FaInstagram, FaYoutubeSquare } from "react-icons/fa";

export default function Footer() {
    return (
        <React.Fragment>
            <section className="footer">
                <div className="f-upper">
                    <div className="f-mod-1">
                        <div className="f-logo" />
                        <h4>Show and tell for designers</h4>
                        <p>
                            What are you working on? Dribbble is a community of designers sharing screenshots of their work, process, and projects.
                                </p>
                        <div className="social-links">
                            <button className="btn-anc"><FaFacebookSquare className="icons" /></button>
                            <button className="btn-anc"><FaInstagram className="icons" /></button>
                            <button className="btn-anc"><FaYoutubeSquare className="icons" /></button>
                        </div>
                    </div>
                    <div className="f-mod-2">
                        <ul>
                            <h4>Information</h4>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Terms</a></li>
                            <li><a href="#">Guidelines</a></li>
                        </ul>
                        <ul>
                            <h4>Reach Us</h4>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">Add a Feedback</a></li>
                        </ul>
                    </div>
                    <div className="f-mod-3">
                        <h4>Our neighbourhood : </h4>
                        <p>Initially, </p>
                    </div>
                </div>
                <div className="f-lower">
                    <div className="f-mod">
                        <span>&copy; copyright 2020.<FaHeart className="icons" /> from WOG team.</span>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}
