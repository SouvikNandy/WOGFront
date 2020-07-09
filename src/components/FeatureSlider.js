import React, { Component } from 'react';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import '../assets/css/featureslider.css';

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
                <div className="swiper-slide featured-content-div">Hello</div>
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
