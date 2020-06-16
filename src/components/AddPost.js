import React, { Component } from 'react';
import Swiper from "swiper";

import "swiper/css/swiper.css";
import "../assets/css/addpost.css";
import { FaCameraRetro, FaPlus } from 'react-icons/fa';
import { AiFillCloseCircle, AiOutlineFileAdd } from 'react-icons/ai';





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
                {/* {this.state.isModalOpen ? <AddDocumentForm showModal={this.showModal} /> : ''} */}
                <AddDocumentForm showModal={this.showModal} />
                <button className="camera-cover" onClick={this.showModal}>
                    <FaCameraRetro className="camera-icon" />
                    <FaPlus className="cam-plus" />
                </button>

            </React.Fragment>
        );

    }

}


class AddDocumentForm extends Component {
    state = {
        FileList: [],
        portfolioName: '',
        description: '',
        members: ['user1', 'user2', 'user3', "user4", "user5", "user6",'user1', 'user2', 'user3', "user4", "user5", "user6",
        'user1', 'user2', 'user3', "user4", "user5", "user6",'user1', 'user2', 'user3', "user4", "user5", "user6"
                ],

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
            members: [...this.state.members.filter((item, index) => index !== idx)]
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
        if (this.state.members.length > 5) {
            allMembers = this.state.members.slice(0, 5);
            allMembers.push("Show All (" + this.state.members.length +") ")
            // add all members to show
            this.state.members.map((item, index) =>{
                existingList.push(
                    <span className="item-span" key={index}>
                        <span>{item}</span>
                        <AiFillCloseCircle className="close-img " onClick={this.onRemoveMember.bind(this, index)} />

                    </span>)
                return existingList
                    
            })
        }
        else {
            allMembers = this.state.members;
        }

        allMembers.map((item, index) => {

            if (item.includes("Show All")) {
                memberlist.push(
                    <span className="item-span item-span-anc" key={index}>
                        <span class="tooltiptext">{existingList}</span>
                        {item}
                        
                    </span>
                )
            }
            else {
                memberlist.push(
                    <span className="item-span" key={index}>
                        <span>{item}</span>
                        <AiFillCloseCircle className="close-img " onClick={this.onRemoveMember.bind(this, index)} />

                    </span>)

            }
        })
        return (
            <React.Fragment>
                <div className="doc-form">
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
                                    onFileDeselect={this.onFileDeselect} />
                                :
                                ""
                            }
                            <div className="select-doc">
                                <input type="file" className="file-selector" name="FileList" multiple="multiple" onChange={this.onFileSelect} required />
                                {this.state.FileList.length > 0 ?
                                    <span id="file-count">
                                        <AiOutlineFileAdd />
                                        <span >{this.state.FileList.length} files selected (add more)</span>
                                    </span>
                                    :
                                    <span id="file-count">
                                        <AiOutlineFileAdd />
                                        <span>Browse from device</span>
                                    </span>

                                }

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
            </React.Fragment >
        )
    }
}


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
    render() {
        console.log(this.props);
        const previewList = [];
        var currUrl = this.props.uploadedFilePreviewList.map((file, index) =>
            <div className="swiper-slide" key={index}>
                {/* <span class="tooltiptext"><img className="uploaded-preview-img-big" src={URL.createObjectURL(file)}></img></span> */}
                <AiFillCloseCircle className="close-img" onClick={this.props.onFileDeselect.bind(this, index)} />
                <img className="uploaded-preview-img" src={URL.createObjectURL(file)}></img>
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
export default AddPost;