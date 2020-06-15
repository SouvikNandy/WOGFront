import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import '../assets/css/landing.css';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import Shot from '../components/Shot';


export class Landing extends Component {
    state = {
        navLinks: [
            {
                label: "Home", link: '#', active: false
            },
            {
                label: "Explore", link: '#', active: false
            },
            {
                label: "Register", link: '/signup/', active: false
            },
            {
                label: "Login", link: '/signin/', active: false
            },
        ]
    }

    componentDidMount() {
        new Swiper('.swiper-container', {
            slidesPerView: "auto",
            spaceBetween: 30,
            centeredSlides: true,
            grabCursor: true,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    render() {
        let shotList = [];
        let reviewList = [];
        let currLocation = this.props.location
        for (let i = 0; i < 32; i++) {
            shotList.push(<Shot key={i} id={i} currLocation={currLocation} />)
        }

        for (let i = 0; i < 10; i++) {
            reviewList.push(<div className="swiper-slide" key={i}><Reviews key={i} /></div>)
        }



        return (
            <React.Fragment>
                <Navbar key="nvlinks" navLinks={this.state.navLinks} _path="home" />
                <div className="landing-layout">
                    {/* hero section */}
                    <section className="hero" id="hero-top">
                        <div className="dark-overlay"></div>
                    </section>
                    {/* shots grid section */}
                    <section className="shots-grid" id="shots-grid">
                        <div className="shots-head"></div>

                        <div className="shots-portfolio">
                            {shotList}
                        </div>
                        <div className="shots-reminder">
                            <p className="s-lead">Create Developer profile/portfolio, share posts and get help form other developers</p>
                            <div className="s-buttons">
                                <a href="/signup/" className="btn">Sign up</a>
                                <span>or</span>
                                <a href="/signin/" className="btn">Login</a>
                            </div>
                        </div>

                    </section>
                    {/* review section */}
                    <section className="reviews-section" id="reviews">
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {reviewList}
                            </div>

                            <div className="swiper-pagination"></div>
                            <div className="swiper-button-next"></div>
                            <div className="swiper-button-prev"></div>
                        </div>
                    </section>
                    <Footer />

                </div>

            </React.Fragment >
        )
    }
}

export default Landing

