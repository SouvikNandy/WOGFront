import React, { Component } from 'react';
import '../assets/css/landing.css';
import pl1 from "../assets/images/people/1.jpg";
import pl2 from "../assets/images/people/2.jpg";
import pl3 from "../assets/images/people/3.jpg";

export class Reviews extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="rev-grid">
                    <div className="rev-top">
                        <img src={images[1].src} alt="img1" />
                    </div>
                    <div className="rev-box">
                        <div className="rev-imgbox">
                            <img src={images[1].src} alt="img1" />
                        </div>
                        <p>
                            where entrepreneurs can easily find the right design for their company.
                            The book cover for us was a very important part of the success of the book.
                            Therefore, we entrusted this to experts and ended up being very happy with the result."
                            where entrepreneurs can easily find the right design for their company.
                            The book cover for us was a very important part of the success of the book.
                            Therefore, we entrusted this to experts and ended up being very happy with the result."
                            where entrepreneurs can easily find the right design for their company.
                            The book cover for us was a very important part of the success of the book.
                            Therefore, we entrusted this to experts and ended up being very happy with the result."
                            where entrepreneurs can easily find the right design for their company.
                            The book cover for us was a very important part of the success of the book.
                            Therefore, we entrusted this to experts and ended up being very happy with the result."
                        </p>
                        <h4>Someone Famous<br /><span>Creative Director</span></h4>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}


const images = [
    { id: 1, src: pl1, title: 'foo', description: 'bar' },
    { id: 2, src: pl2, title: 'foo', description: 'bar' },
    { id: 3, src: pl3, title: 'foo', description: 'bar' },
    { id: 4, src: pl1, title: 'foo', description: 'bar' },
    { id: 5, src: pl2, title: 'foo', description: 'bar' },
]

export default Reviews
