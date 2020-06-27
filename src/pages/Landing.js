import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import '../assets/css/landing.css';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import Shot from '../components/Shot';

// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";

export class Landing extends Component {
    state = {
        navLinks: [
            { key: 1, label: "Home", link: '/', isActive: true },
            { key: 2, label: "Explore", link: '/', isActive: false},
            { key: 3, label: "Register", link: '/signup/', isActive: false},
            { key: 4, label: "Login", link: '/signin/', isActive: false},
        ],
        userShot : [
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1},
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1},
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}
        ],
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
        let shotList = [];
        let reviewList = [];
        let currLocation = this.props.location
        
        this.state.userShot.map(ele => 
            {shotList.push(<Shot key={ele.key} id={ele} data={ele} currLocation={currLocation} />)
            return ele
        })

        for (let i = 0; i < 10; i++) {
            reviewList.push(<div className="swiper-slide" key={i}><Reviews key={i} /></div>)
        }



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
                            {shotList}
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

