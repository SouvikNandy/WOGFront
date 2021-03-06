import React from 'react';
import '../assets/css/landing.css';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaHeart, FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

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
                            <button className="btn-anc"><FaYoutube className="icons" /></button>
                        </div>
                    </div>
                    <div className="f-mod-2">
                        <ul>
                            <h4>Information</h4>
                            <li><HashLink className="link" to={"/commun/#top"}>About</HashLink></li>
                            <li><HashLink className="link" to={"/commun/#how-it-works"}
                            scroll={(el) => el.scrollIntoView({ behavior: 'instant', block: 'end' })}
                            >How It Works</HashLink></li>
                            <li><Link className="link" to={"/privacy-policy"}>Privacy Policy</Link></li>
                            <li><Link className="link" to={"/service-terms"}>Terms</Link></li>
                            
                        </ul>
                        <ul>
                            <h4>Reach Us</h4>
                            <li><HashLink className="link" to={"/commun/#contact-us"}>Contact us</HashLink></li>
                            <li><Link className="link" to={"/"}>FAQ</Link></li>
                            <li><Link className="link" to={"/reviews/"}>Add a Feedback</Link></li>
                        </ul>
                    </div>
                    <div className="f-mod-3">
                        <h4>Our neighbourhood : </h4>
                        <p>Initially, </p>
                    </div>
                </div>
                <div className="f-lower">
                    <div className="f-mod">
                        <span>We call it WOG with <FaHeart className="icons-active" />2020 &copy;copyright</span>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}
