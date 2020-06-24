import React, { Component } from 'react';
import Swiper from "swiper";

import "swiper/css/swiper.css";
import "../assets/css/addpost.css";
import { FaCameraRetro, FaPlus } from 'react-icons/fa';
import { AiFillCloseCircle, AiOutlineFileAdd } from 'react-icons/ai';
import SideBar from "./SideBar";
import { TagUser } from './TagUser';


// Images for shot
import w1 from "../assets/images/wedding1.jpg";


// Add post button
export class AddPost extends Component {
    state = {
        isModalOpen: false
    }

    showModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }


    render() {
        return (
            <React.Fragment>
                {this.state.isModalOpen ? <AddDocumentForm showModal={this.showModal} />
                :
                <button className="camera-cover" onClick={this.showModal}>
                    <FaCameraRetro className="camera-icon" />
                    <FaPlus className="cam-plus" />
                </button>
                }                

            </React.Fragment>
        );

    }

}


// Document Form
class AddDocumentForm extends Component {
    state = {
        // other states
        showSideView: false,
        sideViewContent: [],
        // form data
        FileList: [],
        portfolioName: '',
        description: '',
        members: [
            {"id": 1, "name":"First Last", "username": "user1", "profile_pic": w1, "designation": "photographer"},
            {"id": 2, "name":"First Last", "username": "user2", "profile_pic": w1, "designation": "photographer"},
            {"id": 3, "name":"First Last", "username": "user3", "profile_pic": w1, "designation": "photographer"},
            {"id": 4, "name":"First Last", "username": "user4", "profile_pic": w1, "designation": "photographer"},
            {"id": 5, "name":"First Last", "username": "user5", "profile_pic": w1, "designation": "photographer"},
            {"id": 6, "name":"First Last", "username": "user6", "profile_pic": w1, "designation": "photographer"},
            {"id": 7, "name":"First Last", "username": "user7", "profile_pic": w1, "designation": "photographer"},
            {"id": 8, "name":"First Last", "username": "user8", "profile_pic": w1, "designation": "photographer"},
            {"id": 9, "name":"First Last", "username": "user9", "profile_pic": w1, "designation": "photographer"},
            {"id": 10, "name":"First Last", "username": "user10", "profile_pic": w1, "designation": "photographer"}
        ],

    }

    displaySideView = ({content, sureVal}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal 
        })

        if(content){
            this.setState({
                sideViewContent: content
            })
        }
    }

    onFileSelect = (e) => {
        let prevFiles = this.state.FileList;
        this.setState({
            FileList: [...prevFiles, ...e.target.files]
        });
        // console.log(e.target.files)
    }

    onFileDeselect = (idx) => {
        this.setState({
            FileList: [...this.state.FileList.filter((item, index) => index !== idx)]
        });

    }

    onRemoveMember = (idx) => {
        this.setState({
            members: [...this.state.members.filter(item => item.id !== idx)]
        });

        this.setState({
            sideViewContent: [...this.state.sideViewContent.filter(item => item.props.data.id !== idx)]
        });

    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    onPostSubmit = (e) => {
        e.preventDefault();
        // reset state and form 
        let newState = {
            FileList: [],
            portfolioName: '',
            description: '',
            members: []
        }
        this.setState(newState);
        document.getElementById("img-upload-form").reset();
    }

    render() {
        let memberlist = [];
        let allMembers = [];
        let existingList = [];
        let maxCouunt = window.innerWidth > 1100? 5: 3;

        if (this.state.members.length > maxCouunt) {
            allMembers = this.state.members.slice(0, maxCouunt);
            allMembers.push("Show All (" + this.state.members.length +") ")
            // add all members to show
            this.state.members.map( item =>{
                existingList.push(<TagUser key={item.id} data={item} onRemoveMember={this.onRemoveMember}/>)
                return existingList
                    
            })
        }
        else {
            allMembers = this.state.members;
        }

        allMembers.map(item => {

            if (typeof item === 'string' && item.includes("Show All")) {
                memberlist.push(
                    <span className="item-span item-span-anc" key={item.id} onClick={this.displaySideView.bind(this, {content:existingList, sureVal: true})}>
                        {item}
                    </span>
                )
            }
            else {
                memberlist.push(
                    <span className="item-span" key={item.id}>
                        <span>{item.username}</span>
                        <AiFillCloseCircle className="close-btn close-img " onClick={this.onRemoveMember.bind(this, item.id)} />

                    </span>)

            }
            return true
        })

        return (
            <React.Fragment>
                <div className={this.state.showSideView?"doc-form side-width": "doc-form full-width"}>
                    <form className="img-upload-form" id="img-upload-form" onSubmit={this.onPostSubmit}>
                        <section className="doc-head">
                            <div className="top-logo">
                                <FaCameraRetro className="cam-logo" />
                            </div>

                        </section>
                        <section className="doc-body">
                            <div className="pf-loc">
                                <span className="pf-div">
                                    <label>Portfolio Name <span className="imp-field">*</span> </label>
                                    <input type="text" id="portfolioName" name="portfolioName" onChange={this.onChange} required />
                                </span>
                                <span className="loc-div">
                                    <label>Add Location <span className="imp-field"></span></label>
                                    <input type="text" id="location" name="location" placeholder="Search Location" />
                                </span>
                            </div>
                            
                            <label>Description</label>
                            <textarea type="text" id="description" name="description" onChange={this.onChange} />
                            <label>Members / Contributes</label>
                            {this.state.members.length > 0 ?
                                <div className="member-list">
                                    {memberlist}
                                </div>
                                :
                                ''
                            }
                            <input type="text" id="memo" name="memo" placeholder="Search Members / Contributes" />
                            <label>Attachments <span className="imp-field">*</span> </label>
                            {this.state.FileList.length > 0 ?
                                <UploadedSlider
                                    uploadedFilePreviewList={this.state.FileList}
                                    onFileDeselect={this.onFileDeselect}
                                    displaySideView={this.displaySideView}
                                    prevshowSideView={this.state.showSideView}
                                    />
                                :
                                ""
                            }
                            <div className="select-doc">
                                <input type="file" className="file-selector" name="FileList" multiple="multiple" onChange={this.onFileSelect} required />
                                {this.state.FileList.length > 0 ?
                                    <span id="file-count">
                                        <AiOutlineFileAdd />
                                        <span>{this.state.FileList.length} files selected (add more)</span>
                                    </span>
                                    :
                                    <span id="file-count">
                                        <AiOutlineFileAdd />
                                        <span>Browse from device</span>
                                    </span>

                                }
                                
                            </div>

                            <div className="check-t-c">
                                <input type="checkbox" className="check-box" />
                                <span className="t-c-line">I have read and accepted the following 
                                    <button className="btn-anc t-c-highlight" onClick={this.displaySideView.bind(this, {content: <TandCTemplate />})}> Terms and Conditions</button>
                                </span>
                                
                            </div>

                            

                        </section>
                        <section className="doc-btn">
                            <input type="button"
                                className="btn cancel-btn" value="Cancel"
                                onClick={this.props.showModal} />
                            <input type="submit" className="btn apply-btn" value="Create" />
                        </section>
                    </form>
                </div>
                {this.state.showSideView?
                <div className="form-side-bar-view">
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent}/>
                </div>
                :
                ""
                }
                
            </React.Fragment >
        )
    }
}



// Document form image Slider

class UploadedSlider extends Component {
    componentDidMount() {
        new Swiper('.swiper-container', {
            slidesPerView: "auto",
            spaceBetween: 10,
            centeredSlides: true,
            grabCursor: true,
            // loop: true,
            // pagination: {
            //     el: '.swiper-pagination',
            //     clickable: true,
            // },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    getSidebarDisplayImg = (curUrl) =>{
        return <img className="side-bar-display-img" alt="" src={URL.createObjectURL(curUrl)} />
    }
    render() {
        const previewList = [];
        var currUrl = this.props.uploadedFilePreviewList.map((file, index) =>
            <div className="swiper-slide" key={index}>
                <AiFillCloseCircle className="close-btn close-img" onClick={this.props.onFileDeselect.bind(this, index)} />
                <img className="uploaded-preview-img" alt="" src={URL.createObjectURL(file)} 
                onClick={this.props.displaySideView.bind(this, {content: this.getSidebarDisplayImg(file), sureVal: true})}></img>
            </div>

        );
        previewList.push(currUrl);

        return (
            <React.Fragment>
                <div className="uploaded-preview">
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {previewList}
                        </div>

                        {/* <div className="swiper-pagination"></div> */}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}



function TandCTemplate(){
    return(
        <React.Fragment>
            <h3>Terms and Conditions</h3>
            <p>These terms and conditions outline the rules and regulations for the use of Company Name's Website, located at Website.com.<br/>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Website Name if you do not agree to take all of the terms and conditions stated on this page.<br/>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person log on this website and compliant to the Company's terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.<br/>
            </p>
            <h4>Cookies</h4>
            <p>
            
                We employ the use of cookies. By accessing Website Name, you agreed to use cookies in agreement with the Company Name's Privacy Policy.

                Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.

                License
                Unless otherwise stated, Company Name and/or its licensors own the intellectual property rights for all material on Website Name. All intellectual property rights are reserved. You may access this from Website Name for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
        </React.Fragment>
    )
}
export default AddPost;