import React, { Component } from 'react';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import '../assets/css/userview.css';
import '../assets/css/featureslider.css';
import { UserCube } from './Profile/UserView';

// Images for shot
import w1 from "../assets/images/wedding1.jpg";

function FeatureTab() {
        let ele = {"id": 1, "name":"First Last", "username": "user1", "profile_pic": w1, "designation": "photographer"}
        return(
            <div className="cube-grid featured-content-div">
                <div className="f-user-div">
                    <UserCube data={ele} />
                </div>
                <div className="f-image-div">
                    <img src={w1} alt=""></img>
                </div>
                

            </div>
        )
    }

export class FeatureSlider extends Component {
    componentDidMount() {
        new Swiper('.swiper-container', {
            slidesPerView: "auto",
            spaceBetween: 30,
            centeredSlides: true,
            grabCursor: true,
            loop: true,
            // pagination: {
            //     el: '.swiper-pagination',
            //     clickable: true,
            // },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    render() {
        let outputList = [];
        for(let i=0; i<20; i++){
            outputList.push(
                <div key={i} className="swiper-slide">
                    <FeatureTab />
                </div>
            )
        }
        return (
            <div className="featured-container">
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {outputList}
                    </div>
                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>

            </div>
            
        )
    }
}

export default FeatureSlider
