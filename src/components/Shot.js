import React, { Component } from 'react';
import '../assets/css/landing.css';


import { Link } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";

class Shot extends Component {
    render() {
        let data = this.props.data
        let shotClass = this.props.onlyShot ? "shot-preview-alt" : "shot-preview"
        return (
            <React.Fragment>
                <div className={shotClass}>
                    <Link className="sp-img"
                        key={data.key}
                        to={{
                            pathname: `/shot-view/${data.id}`,
                            // This is the trick! This link sets
                            // the `background` in location state.
                            state: { modal: true, currLocation: this.props.currLocation }
                        }}>

                        <img src={data.shot} alt="" />
                    </Link>
                    {!this.props.onlyShot ?
                        <span className="attribution-user">
                            <span className="user-preview">
                                <img src={data.profile_pic} alt="" />
                                <span className="display-name">{data.name} @{data.username}</span>
                            </span>

                            <span className="like-comment-share-preview">
                                <FaHeart className="icons" /><span>{data.likes}</span>
                                <FaComment className="icons" /><span>{data.comments}</span>
                            </span>
                        </span>
                        : ''}
                </div>
                
            </React.Fragment>
        )

    }

}

export default Shot;