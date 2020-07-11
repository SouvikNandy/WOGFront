import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/css/landing.css';
import {ReviewSwiper} from '../components/Reviews';
import Footer from '../components/Footer';
// import Shot from '../components/Shot';
import { FaAngleRight } from "react-icons/fa";
import ShotPalette from '../components/Shot';

export class Landing extends Component {
    state = {
        navLinks: [
            { key: 1, label: "Home", link: '/', isActive: true },
            { key: 2, label: "Explore", link: '/explore/', isActive: false},
            { key: 3, label: "Register", link: '/signup/', isActive: false},
            { key: 4, label: "Login", link: '/signin/', isActive: false},
        ],
    }

    selectMenu = (key) =>{
        this.setState({
            navLinks: this.state.navLinks.map(item=>{
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
        let currLocation = this.props.location
        return (
            <React.Fragment>
                <Navbar key="nvlinks" navLinks={this.state.navLinks} selectMenu={this.selectMenu} />
                <div className="landing-layout">
                    {/* hero section */}
                    <section className="hero" id="hero-top">
                        <div className="dark-overlay"></div>
                    </section>
                    {/* shots grid section */}
                    <section className="shots-grid" id="shots-grid">
                        <div className="shots-head"></div>

                        <div className="shots-portfolio">
                            <ShotPalette currLocation={currLocation}/>
                        </div>
                        <div className="shots-reminder">
                            <p className="s-lead">Create Developer profile/portfolio, share posts and get help form other developers</p>
                            <div className="s-buttons">
                                <Link to={"/signup/"} className="btn" >Sign up</Link>
                                <span>or</span>
                                <Link to={"/signin/"} className="btn" >Login</Link>
                            </div>
                        </div>

                    </section>
                    {/* review section */}
                    <section className="reviews-section" id="reviews">
                        <ReviewSwiper />
                        <span className="visit-review">
                            <Link className="link" to={'/reviews'}>
                                <span>Take Me To Reviews</span>
                                <FaAngleRight />
                            </Link>
                            
                            </span>
                    </section>
                    
                    <Footer />

                </div>

            </React.Fragment >
        )
    }
}

export default Landing

