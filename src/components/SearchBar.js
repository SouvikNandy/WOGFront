import React from 'react';
import "../assets/css/config.css";

import { GrSearchAdvanced } from "react-icons/gr";


export default function SearchBar(props) {
    const placeHolder = "Search Shots/Events/People ..."
    return (
        <div className="search-div">
            <input type="text" placeholder={placeHolder} />
            <button className="btn-anc search-btn"><GrSearchAdvanced className="srch-icon" /></button>
        </div>
    )
}
