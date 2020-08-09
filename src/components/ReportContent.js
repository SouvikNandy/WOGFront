import React, { Component } from 'react';
import '../assets/css/reportContent.css';
import {GoReport} from "react-icons/go";
import {AiFillPlusCircle, AiOutlineCopyright, AiFillWarning} from 'react-icons/ai';

export class ReportContent extends Component {
    state ={
        reason: '',
        tcApproved: false
    }

    selectReason = (statement) =>{
        this.setState({reason: statement})
    }

    customReason = () =>{
        let ele = document.getElementById('other-reasons');
        if(ele.value){
            this.selectReason(ele.value)
            ele.value=""
        }   
    }

    approveTC = () =>{
        this.setState({tcApproved: !this.state.tcApproved})
    }
    onSubmit = () =>{

    }

    render() {
        let reportReasons = [];
        if (this.props.copyrightClaim === true){
            reportReasons = [
            "I appear in this content without permission",
            "Abuse/Harassment (Someone is attacking me)",
            "Privacy (Someone is using my image)",
            "Trademark infringement (Someone is using my trademark)",
            "Copyright infringement (Someone copied my creation)",
            "Other legal issue (including the circumvention of technological measures, such as providing keygens or serial numbers)"]
        }
        else{
            reportReasons = ["Violence", "Harassment", "Spam", "Explicit content", "Terrorism", "Spreading hatred"]

        }
        let reportReasonBlock = [];
        reportReasons.map((ele, index) =>{
            reportReasonBlock.push(
            <span className="item-span item-span-anc" key={index} onClick={this.selectReason.bind(this, ele)}>{ele}</span>
            )
            return ele
        })
        return (
            <div className="report-container">
                <div className="top-line">
                    <div className="headline">
                        {this.props.copyrightClaim === true?
                        <React.Fragment>
                            <AiOutlineCopyright className="r-icon"/>
                            <span>Submit a copyright takedown notice</span>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <GoReport className="r-icon"/>
                            <span>Why are you reporting this?</span>
                        </React.Fragment>

                        }
                        
                    </div>
                    <span className="info-text">
                        {this.props.copyrightClaim === true?
                        "Claim copyright to take down content from other's profile."
                        :
                        "You can report the content after providing a problem."
                        }
                        
                    </span>
                </div>
                <div className="report-reasons">
                    <div className="suggested-reasons">
                        {reportReasonBlock}
                    </div>

                    {this.props.copyrightClaim === true?
                    ""
                    :
                    <div className="custom-reason">
                        <input type="text" className="inp-box" id="other-reasons" placeholder="Add your reason ..."></input>
                        <AiFillPlusCircle className="add-icon" onClick={this.customReason} />
                    </div>
                    }

                </div>
                <div className="selected-report">
                    <span>{this.props.copyrightClaim === true? 
                    "I hereby claim copyright for the following reason : "
                    :
                    "I'm reporting this post for the following reason : "
                    } 
                        <span className="report-reason">{this.state.reason}</span>
                    </span>
                </div>
                <DisclaimerBox approveTC={this.approveTC}/>
                <div className="submission-box">
                    {this.state.tcApproved?
                    <button className="btn s-btn" onClick={this.onSubmit}>Proceed</button>
                    :
                    <button className="btn s-btn">Proceed</button>
                    }
                        
                </div>
            </div>
        )
    }
}


function DisclaimerBox(props){
    return(
        <div className="disclaimer-box">
                    <div className="db-top">
                        <span>Please note:</span>
                    </div>
                    <div className="db-terms">
                        <span>1. Trems of services 1</span>
                        <span>1. Trems of services 1</span>
                        <span>1. Trems of services 1</span>
                        <span>1. Trems of services 1</span>
                        <span>1. Trems of services 1</span>
                        <span className="warn-text"> <AiFillWarning className="warn-sym"/> Do not make false claims. 
                            Misuse of this process may result in the suspension of your account or other legal consequences.</span>
                    </div>
                    <div className="db-bottom">
                        <input type="checkbox" onChange={props.approveTC}/> I have read and agreed to the terms above
                    </div>
                </div>

    )
}

export default ReportContent
