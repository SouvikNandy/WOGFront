import React from 'react';
import '../assets/css/profile.css';

export default function Subnav() {
    return (
        <React.Fragment>
            <div className="profile-subnav">
                <ul className="sub-nav">
                    <li>Shots <span>100</span></li>
                    <li>Portfolio <span>100</span></li>
                    <li>Tags <span>100</span></li>
                    <li>Followers <span>100</span></li>
                    <li>Following <span>100</span></li>
                    <li>About</li>
                </ul>
            </div>
        </React.Fragment>
    )
}
