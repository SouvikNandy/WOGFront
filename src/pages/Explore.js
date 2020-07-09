import React, { Component } from 'react';
import "../assets/css/explore.css";
import '../assets/css/profile.css';
import SearchHead from '../components/SearchHead';
import {Shot} from '../components/Shot';
// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";
import Footer from '../components/Footer';
import FeatureSlider from '../components/FeatureSlider';


export class Explore extends Component {
    state ={
        userShot : [
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1},
            {id: 6, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 7, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 8, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}, 
            {id: 9, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2}, 
            {id: 10, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1}
        ],
    }
    render() {
        let resultList = [];
        this.state.userShot.map(ele => 
            {resultList.push(<Shot key={ele.id} id={ele} onlyShot={true} data={ele} currLocation={this.props.location} />)
            return ele
        })
        return (
            <div className="explore-container">
                {/* hero section */}
                <section className="explore-hero">
                        <div className="dark-overlay"></div>
                        <div className="e-head-content">
                            <SearchHead />
                            <div className="e-head-suggestions">
                                <div className="e-fixed-sug">
                                    <span key={"ef1"} className="item-span">People</span>
                                    <span key={"ef2"} className="item-span">Events</span>
                                    <span key={"ef3"} className="item-span">Places</span>
                                </div>
                                <div className="e-floating-sug">
                                    <span key={"efl1"} className="item-span">Photogarphers</span>
                                    <span key={"efl2"} className="item-span">Designers</span>
                                    <span key={"efl3"} className="item-span">Makeup-artists</span>
                                    <span key={"efl4"} className="item-span">Freelancers</span>
                                </div>
                            </div>
                        </div>
                </section>
                {/* Featured Slider */}
                <section className="featured-slider">
                    <FeatureSlider />
                </section>
                <section className="explore-shots">
                    <div className="profile-shots">
                        {resultList}
                    </div>
                </section>
                <Footer />


            </div>
        )
    }
}

export default Explore
