import React, { Component } from 'react';
import Swiper from "swiper";

import "swiper/css/swiper.css";
import "../../assets/css/addpost.css";
import { FaCameraRetro, FaPlus } from 'react-icons/fa';
import { AiFillCloseCircle, AiOutlineFileAdd } from 'react-icons/ai';
import SideBar from "../SideBar";
import { TagUser } from '../Profile/TagUser';
import IndianCityList from '../IndianCityList';
import FriendList from '../Profile/FriendList';
import CommmunityGuidelines from '../../pages/CommunityGuidelines';
import ImgCompressor from '../../utility/ImgCompressor';
import HTTPRequestHandler from '../../utility/HTTPRequests';


// video thumbnail
import videoThumbnail from '../../assets/images/icons/video-thumbnail.jpg'
import { createFloatingNotification } from '../FloatingNotifications';

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
        // sidebar states
        showSideView: false,
        sideBarHead: true,
        searchBarRequired: false,
        sideViewContent: [],
        altHeadText : null,

        // diabled fields
        disabledFields: [],
        
        // form data
        FileList: [],
        portfolioName: '',
        description: '',
        taggedMembers: [],

    }

    onSubmit =() =>{
        console.log("current state", this.state)
        let url = 'api/v1/add-post/'
        let formData = new FormData();
        this.state.FileList.map(ele=>  formData.append("attachments", ele))
       
        formData.append("portfolio_name", this.state.portfolioName)
        formData.append("description", this.state.description)
        formData.append("location", document.getElementById("location").value)

        HTTPRequestHandler.post(
            {url:url, requestBody: formData, includeToken:true, uploadType: 'file', callBackFunc: this.successfulUpload, errNotifierTitle:"Uplading failed !"})
        
        // close modal and notify user 
        this.props.showModal();
        createFloatingNotification('warning' ,'Your shots are being uploaded!', "It may took a while. We will notify you as soon as its done");
    }

    successfulUpload = (data) =>{
        createFloatingNotification('success' ,'Your shots have been posted!', data.message);

    }

    displaySideView = ({content, sureVal, altHeadText=null}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            sideBarHead: true,
            altHeadText: altHeadText,
            

        })

        if(content){
            this.setState({
                sideViewContent: content
            })
        }

        // on close clear diabled fields
        this.clearDisabledFields();
        
    }

    clearDisabledFields = () =>{
        if (this.state.disabledFields){
            this.state.disabledFields.map(name =>{
                document.getElementById(name).disabled = false
                return name
            })
    
            this.setState({
                // on close also clear the diasble fields
                disabledFields: []
            })
        } 
    }

    onFileSelect = (e) => {
        // console.log("selected files", e.target.files)
        // compress image list
        let uncompressed = ImgCompressor(e, this.addFileToState, null, true)
        if(uncompressed.length> 0) {
            this.setState({
            FileList: [...this.state.FileList, ...uncompressed]
        })
        }  
    }

    addFileToState = (compressedFile) =>{
        this.setState({
            FileList: [...this.state.FileList, compressedFile]
        });

    }

    onFileDeselect = (idx) => {
        this.setState({
            FileList: [...this.state.FileList.filter((item, index) => index !== idx)]
        });

    }

    onRemoveMember = (idx, removeTagOnly=false) => {
        if(removeTagOnly===true){
            this.setState({
                taggedMembers: [...this.state.taggedMembers.filter(item => item.id !== idx)],
            });
        }
        else{
            this.setState({
                taggedMembers: [...this.state.taggedMembers.filter(item => item.id !== idx)],
                sideViewContent: [...this.state.sideViewContent.filter(item => item.props.data.id !== idx)]
            });
        }
        

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
            taggedMembers: []
        }
        this.setState(newState);
        document.getElementById("img-upload-form").reset();
    }
    chooseOptions =(fieldID, content) =>{
        // clear previous disabled
        this.clearDisabledFields();

        // display content in sidebaer with searchable content 
        document.getElementById(fieldID).disabled = true;
        this.setState({
            showSideView: true,
            sideBarHead: false,
            sideViewContent: content,
            disabledFields: [fieldID],
        })
    }

    tagMembers = (record) =>{
        this.setState({
            taggedMembers : [...this.state.taggedMembers, record]
        })

    }

    render() {
        let memberlist = [];
        let alltaggedMembers = [];
        let existingList = [];
        let maxCouunt = window.innerWidth > 1100? 4: 3;
        if (this.state.taggedMembers.length > maxCouunt) {
            alltaggedMembers = this.state.taggedMembers.slice(0, maxCouunt);
            alltaggedMembers.push("Show All (" + this.state.taggedMembers.length +") ")
            // add all taggedMembers to show
            this.state.taggedMembers.map( item =>{
                existingList.push(<TagUser key={item.id} data={item} onRemoveMember={this.onRemoveMember}/>)
                return existingList
                    
            })
        }
        else {
            alltaggedMembers = this.state.taggedMembers;
        }

        alltaggedMembers.map(item => {

            if (typeof item === 'string' && item.includes("Show All")) {
                memberlist.push(
                    <span className="item-span item-span-anc" key="ShowAll" onClick={this.displaySideView.bind(this, {content:existingList, sureVal: true})}>
                        {item}
                    </span>
                )
            }
            else {
                memberlist.push(
                    <span className="item-span" key={item.id}>
                        <span>{item.username}</span>
                        <AiFillCloseCircle className="close-btn close-img " onClick={this.onRemoveMember.bind(this, item.id, true)} />

                    </span>)

            }
            return true
        })

        return (
            <React.Fragment>
                <div className={this.state.showSideView?"doc-form with-side-width": "doc-form full-width"}>
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
                                    <input type="text" id="location" name="location" placeholder="Search Location" 
                                    onSelect={this.chooseOptions.bind(
                                        this, 
                                        'location',
                                        <IndianCityList 
                                            displaySideView={this.displaySideView} searchPlaceHolder={"Find a location ..."} 
                                            populateOnDestinationID={'location'}
                                        />
                                    )}/>
                                </span>
                            </div>
                            
                            <label>Description</label>
                            <textarea type="text" id="description" name="description" onChange={this.onChange} />
                            <label>Members / Contributes</label>
                            {this.state.taggedMembers.length > 0 ?
                                <div className="member-list">
                                    {memberlist}
                                </div>
                                :
                                ''
                            }
                            <input type="text" id="memo" name="memo" placeholder="Search Members / Contributes" 
                            onSelect={this.chooseOptions.bind(
                                this, 
                                'memo',
                                <FriendList 
                                    displaySideView={this.displaySideView} searchPlaceHolder={"Search For Friends ..."} 
                                    populateOnDestinationID={'memo'} tagMembers={this.tagMembers}
                                    currentTags={this.state.taggedMembers}
                                    currentTagIDs={this.state.taggedMembers.map(ele => ele.id )}
                                    onRemoveMember={this.onRemoveMember}
                                />
                            )}/>
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
                                    <button className="btn-anc t-c-highlight" onClick={this.displaySideView.bind(this, {content: <TandCTemplate />, sureVal: true, altHeadText: "Terms of use"})}> Terms and Conditions</button>
                                </span>
                                
                            </div>

                            

                        </section>
                        <section className="doc-btn">
                            <input type="button"
                                className="btn cancel-btn" value="Cancel"
                                onClick={this.props.showModal} />
                            <input type="submit" className="btn apply-btn" value="Create" onClick={this.onSubmit}/>
                        </section>
                    </form>
                </div>
                {this.state.showSideView?
                <div className="form-side-bar-view side-bar-view-active">
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent} 
                    searchPlaceHolder={this.state.searchPlaceHolder} sideBarHead={this.state.sideBarHead}
                    searchBarRequired={this.state.searchBarRequired} altHeadText={this.state.altHeadText}/>
                </div>
                :
                <div className="form-side-bar-view"></div>
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

    getSidebarDisplayImg = (fileObj) =>{
        if (fileObj.type.startsWith("image/")){
            return <img className="side-bar-display-img" alt="" src={URL.createObjectURL(fileObj)} />
        }
        else{
            return <video className="side-bar-display-img" alt="" src={URL.createObjectURL(fileObj)} controls autoPlay />
        }
        
    }
    render() {
        const previewList = [];
        let currUrl = this.props.uploadedFilePreviewList.map((file, index) =>{
            return(
                <div className="swiper-slide" key={index}>
                    <AiFillCloseCircle className="close-btn close-img" onClick={this.props.onFileDeselect.bind(this, index)} />
                    {file.type.startsWith("image/") ?
                    <img className="uploaded-preview-img" alt="" src={URL.createObjectURL(file)} 
                    onClick={this.props.displaySideView.bind(this, {content: this.getSidebarDisplayImg(file), sureVal: true})}></img>
                    :
                    <img className="uploaded-preview-img" alt="" src={videoThumbnail} 
                    onClick={this.props.displaySideView.bind(this, {content: this.getSidebarDisplayImg(file), sureVal: true})}></img>
                    }
                
                </div>

            )
        });
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
            <CommmunityGuidelines />
        </React.Fragment>
    )
}
export default AddPost;