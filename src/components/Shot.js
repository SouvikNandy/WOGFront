import React, { Component } from 'react';
import '../assets/css/landing.css';


import { Link } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";

// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import w2 from "../assets/images/wedding2.jpg";
import w3 from "../assets/images/wedding3.jpg";
import pl2 from "../assets/images/people/2.jpg";

class Shot extends Component {
    render() {
        let imageArr = [w1, w2, w3, pl2];
        const selectedImg = imageArr[Math.floor(Math.random() * imageArr.length)];
        let shotClass = this.props.onlyShot ? "shot-preview-alt" : "shot-preview"
        console.log(shotClass)
        return (
            <React.Fragment>
                <div className={shotClass}>
                    <Link className="sp-img"
                        key={this.props.id}
                        to={{
                            pathname: `/shot-view/${this.props.id}`,
                            // This is the trick! This link sets
                            // the `background` in location state.
                            state: { modal: true, currLocation: this.props.currLocation }
                        }}>

                        <img src={selectedImg} alt="" />
                    </Link>
                    {!this.props.onlyShot ?
                        <span className="attribution-user">
                            <span className="user-preview">
                                <img src={selectedImg} alt="" />
                                <span className="display-name">Dmytry @eushevy</span>
                            </span>

                            <span className="like-comment-share-preview">
                                <FaHeart className="icons" /><span>100</span>
                                <FaComment className="icons" /><span>100</span>
                            </span>
                        </span>
                        : ''}
                </div>
                
            </React.Fragment>
        )

    }

}

export default Shot;