import React from 'react';
import "../assets/css/config.css";

import { GrSearchAdvanced } from "react-icons/gr";

import GoBack from "../components/GoBack";

export default function SearchHead() {
    return (
        <React.Fragment>
            <div className="srch-box">
                <div className="back-div">
                    <GoBack />
                </div>
                <div className="search-div">
                    <input type="text" placeholder="Search Shots/Events/People ..." />
                    <button className="btn-anc search-btn"><GrSearchAdvanced className="srch-icon" /></button>
                </div>

            </div>

        </React.Fragment>
    )
}
