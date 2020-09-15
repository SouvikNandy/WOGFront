import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import '../assets/css/landing.css';
import {ReviewSwiper} from '../components/Review/Reviews';
import Footer from '../components/Footer';
// import Shot from '../components/Shot';
import { FaAngleRight } from "react-icons/fa";
import ShotPalette from '../components/Post/Shot';
import { isAuthenticated } from '../utility/Utility';
import getUserData from '../utility/userData';

export class Landing extends Component {
    state = {
        navLinks: [
            { key: 1, label: "Home", link: '/', isActive: true },
            { key: 2, label: "Explore", link: '/explore/', isActive: false},
            { key: 3, label: "Register", link: '/signup/', isActive: false},
            { key: 4, label: "Login", link: '/signin/', isActive: false},
        ],
        loggedInUser: null
    }
    componentDidMount(){
        if(isAuthenticated()){
            let userdata = getUserData();
            this.setState({loggedInUser: userdata.username})

        }
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
        if(this.state.loggedInUser){
            return(<Redirect to={`/user-feeds/${this.state.loggedInUser}`} />)
        }
        return (
            <React.Fragment>
                <div className="landig-nav">
                    <Navbar key="nvlinks" navLinks={this.state.navLinks} selectMenu={this.selectMenu} />
                </div>
                
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
                            <p className="s-lead">Create your own portfolios, share shots and get connected to others of your domain  </p>
                            <div className="s-buttons">
                                <Link to={"/signup/"} className="btn" >Sign up</Link>
                                <span>/</span>
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

