import React, { Component } from 'react';
import '../assets/css/reportContent.css';
import {GoReport} from "react-icons/go";
import {AiFillPlusCircle} from 'react-icons/ai';

export class ReportContent extends Component {
    render() {
        let reportReasons = ["Violence", "Harassment", "Spam", "Explicit content", "Terrorism", "Spreading hatred"];
        let reportReasonBlock = [];
        reportReasons.map((ele, index) =>{
            reportReasonBlock.push(
            <span className="item-span item-span-anc" key={index}>{ele}</span>
            )
            return ele
        })
        return (
            <div className="report-container">
                <div className="top-line">
                    <div className="headline">
                        <GoReport className="r-icon"/>
                        <span>Why are you reporting this?</span>
                    </div>
                    <span className="info-text">
                        You can report the content after providing a problem.
                    </span>
                </div>
                <div className="report-reasons">
                    <div className="suggested-reasons">
                        {reportReasonBlock}
                    </div>
                    <div className="custom-reason">
                        <input type="text" className="inp-box" placeholder="Add your reason ..."></input>
                        <AiFillPlusCircle className="add-icon" />
                    </div>
                </div>
                <div className="disclaimer-box">
                    

                </div>
            </div>
        )
    }
}

export default ReportContent
