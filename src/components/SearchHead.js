import React from 'react';
import GoBack from "../components/GoBack";
import SearchBar from "../components/SearchBar";

export default function SearchHead() {
    return (
        <React.Fragment>
            <div className="srch-box">
                <div className="back-div">
                    <GoBack />
                </div>
                <SearchBar />
            </div>

        </React.Fragment>
    )
}
