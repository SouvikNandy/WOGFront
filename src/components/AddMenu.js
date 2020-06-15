import React, { Component } from 'react';
import Swiper from "swiper";

import "swiper/css/swiper.css";
import "../assets/css/cambtn.css";
import { FaCameraRetro, FaPlus } from 'react-icons/fa';
import { AiFillCloseCircle, AiOutlineFileAdd } from 'react-icons/ai';





export class AddMenu extends Component {
    state = {
        isModalOpen: false
    }

    showModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }

    render() {
        return (
            <React.Fragment>
                {/* {this.state.isModalOpen? <AddDocumentForm />:''} */}
                <AddDocumentForm />
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
        FileList: []
    }

    onFileSelect = (e) => {
        this.setState({
            "FileList": [...e.target.files]
        });
        console.log(e.target.files)
        // console.log(e.target.files.length + " files Selected")
    }


    render() {
        return (
            <React.Fragment>
                <div className="doc-form">
                    <form className="img-upload-form">
                        <section className="doc-head">
                            <div className="top-logo">
                                <FaCameraRetro className="cam-logo" />
                            </div>

                        </section>
                        <section className="doc-body">
                            <label>Portfolio Name</label>
                            <input type="text" id="fname" name="fname" />
                            <label>Description</label>
                            <textarea type="text" id="lname" name="lname" />
                            <label>Members</label>
                            <input type="text" id="memo" name="memo" />
                            <label>Attachments</label>
                            {this.state.FileList.length > 0 ?
                                <UploadedSlider uploadedFilePreviewList={this.state.FileList} />
                                :
                                ""
                            }
                            {/* <UploadedSlider uploadedFilePreviewList={this.state.FileList} /> */}

                            <div className="select-doc">
                                <input type="file" className="file-selector" name="FileList" multiple="multiple" onChange={this.onFileSelect} />
                                {this.state.FileList.length > 0 ?
                                    <span id="file-count">
                                        <AiOutlineFileAdd />
                                        <span >{this.state.FileList.length} files selected</span>
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
                            <input type="submit" value="Submit" />
                        </section>
                    </form>
                </div>
            </React.Fragment>
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
                <AiFillCloseCircle className="close-img" />
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
export default AddMenu;