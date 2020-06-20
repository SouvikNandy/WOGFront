import React from 'react';
import '../assets/css/subnav.css';

export default function Subnav() {
    const navList = [];
    navList.push(<li>Shots <span>100</span></li>)
    navList.push(<li>Portfolio <span>100</span></li>)
    navList.push(<li>Tags <span>100</span></li>)
    navList.push(<li>Followers <span>100</span></li>)
    navList.push(<li>Following <span>100</span></li>)
    navList.push(<li>About</li>)
    return (
        <React.Fragment>
            <div className="profile-subnav">
                <ul className="sub-nav">
                    {navList}
                </ul>
            </div>
        </React.Fragment>
    )
}
