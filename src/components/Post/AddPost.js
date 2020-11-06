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
import videoThumbnail from '../../assets/images/icons/demo-logo.png';
import { createFloatingNotification } from '../FloatingNotifications';
import TextInput, { ExtractToJSON } from '../TextInput';
import getUserData from '../../utility/userData';

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
                {this.state.isModalOpen ? <AddDocumentForm showModal={this.showModal} onSuccessfulUpload={this.props.onSuccessfulUpload} />
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
export class AddDocumentForm extends Component {
    state = {
        currUser : getUserData(),
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
        pricingContainer: {},

        // uploading progress
        uploadProgress: 0

    }
    componentDidMount(){
        if (this.props.pricingContainer){
            this.setState({pricingContainer: this.props.pricingContainer})
        }
        if (this.props.members){
            this.setState({taggedMembers: this.props.members})
        }
        
    }

    validateForm = () =>{
        if(!this.state.portfolioName){
            createFloatingNotification("error", "Portfolio Name must be provided!", "Provide a portfolio name that suits your content")
            return false
        }
        else if(!this.state.FileList.length> 0){
            createFloatingNotification("error", "Attach some shots!", "Your portfolio must have some shots attached.")
            return false
        }
        else if (!document.getElementById("tc-checked").checked === true){
            createFloatingNotification("error", "You must accept the terms!", "Your can click on Terms and Conditions to know more.")
            return false
        }
        else{
            return true
        }
        
    }

    onUpdate = (e) =>{
        e.preventDefault();
        if (!document.getElementById("tc-checked").checked === true){
            createFloatingNotification("error", "You must accept the terms!", "Your can click on Terms and Conditions to know more.")
            return false
        }
        document.getElementById("tc-checked").checked = false
        let requestBody ={}
        if (this.state.portfolioName && this.state.portfolioName!==this.props.portfolio_name){
            requestBody["portfolio_name"] = this.state.portfolioName
        }
        if (this.state.description){
            requestBody["description"] = JSON.stringify(ExtractToJSON(this.state.description))
        }
        if (this.state.taggedMembers){
            requestBody["members"] = this.state.taggedMembers.map(ele=> ele.username)
        }
        if (this.state.currUser.user_type==="T"){
            requestBody["pricing_container"] = this.state.pricingContainer
        }
        let location = document.getElementById("location").value
        if(location && location!=="" && location!==this.props.location){
            requestBody["location"] = location
        }
        this.props.updatePostDetails(requestBody);   
    }


    onSubmit =(e) =>{
        e.preventDefault();
        let _validated = this.validateForm()
        if (!_validated){
            return false
        }
        let url = 'api/v1/add-post/'
        let formData = new FormData();
        this.state.FileList.map(ele=>  formData.append("attachments", ele))
       
        formData.append("portfolio_name", this.state.portfolioName)
        formData.append("description", JSON.stringify(ExtractToJSON(this.state.description)))
        formData.append("location", document.getElementById("location").value);
        formData.append("members", JSON.stringify(this.state.taggedMembers.map(ele=> ele.username)))
        if(this.state.currUser.user_type==="T"){
            formData.append("pricing_container", JSON.stringify(this.state.pricingContainer))
        }
        

        HTTPRequestHandler.post(
            {url:url, requestBody: formData, includeToken:true, uploadType: 'file', 
            callBackFunc: this.successfulUpload.bind(this, this.props.onSuccessfulUpload), 
            errNotifierTitle:"Uplading failed !", onUploadProgress:this.onUploadProgress})
        
        // close modal and notify user 
        this.props.showModal();
        createFloatingNotification('warning' ,'Your shots are being uploaded!', "It may took a while. We will notify you as soon as its done");
    }

    successfulUpload = (successCallBAck, data) =>{
        if(successCallBAck){
            successCallBAck(data.data)
        }
        createFloatingNotification('success' ,'Your shots have been posted!', data.message);

    }

    onUploadProgress =(progressEvent) =>{
        const {loaded, total} = progressEvent;
        let percent = Math.floor((loaded* 100)/ total)
        console.log( `uploading: ${loaded}kb of ${total}kb | ${percent}%` )

    }

    displaySideView = ({content, sureVal, altHeadText=null}) =>{
        let stateVal = !this.state.showSideView
        // console.log("displaySideView called")
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
        if (this.props.sideViewOnChange){
            this.props.sideViewOnChange(stateVal)
        }
        
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
    onChangeDescription = (key, val) => this.setState({
        [key] : val
    })

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
        if (this.props.sideViewOnChange){
            this.props.sideViewOnChange(true)
        }
    }

    tagMembers = (record) =>{
        this.setState({
            taggedMembers : [...this.state.taggedMembers, record]
        })

    }
    feedPriceOfIndex = (sidx) =>{
        if(this.props.pricingContainer.hasOwnProperty(sidx)){
            document.getElementById("item-price").value= this.props.pricingContainer[sidx]
        }
        else{
            document.getElementById("item-price").value = 0
        }
                                                

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

        let fileListForPricing = this.props.FileList? this.props.FileList: this.state.FileList

        return (
            <React.Fragment>
                <div className={this.state.showSideView?"doc-form with-side-width": "doc-form full-width"}>
                    <form className="img-upload-form" id="img-upload-form">
                        <section className="doc-head">
                            <div className="top-logo">
                                <FaCameraRetro className="cam-logo" />
                            </div>

                        </section>
                        <section className="doc-body">
                            <div className="pf-loc">
                                <span className="pf-div">
                                    <label>Portfolio Name <span className="imp-field">*</span> </label>
                                    <input type="text" id="portfolioName" name="portfolioName" defaultValue={this.props.portfolio_name} onChange={this.onChange} required />                                    
                                </span>
                                <span className="loc-div">
                                    <label>Add Location <span className="imp-field"></span></label>
                                    <input type="text" id="location" name="location" placeholder="Search Location" 
                                    defaultValue={this.props.location}
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
                            <TextInput  id="description" onChange={this.onChangeDescription.bind(this, 'description')} editorState={this.props.description}/>
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
                            <label className="attach-label">Attachments <span className="imp-field">*</span> </label>
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
                            {this.state.currUser.user_type === "T"?
                                <div className="allow-price">
                                    <label className="price-label">Add pricing to product</label>
                                    <div className="pricing-container">
                                        <select className="select-pricing" id="img-index-dropdown" onChange={(ele) =>{
                                            if(this.props.pricingContainer){
                                                this.feedPriceOfIndex(ele.target.value)
                                            }
                                            else{
                                                let oldPricing = this.state.pricingContainer;
                                                if (!(oldPricing.hasOwnProperty(ele.target.value))) {
                                                    oldPricing[ele.target.value] = document.getElementById("item-price").value? document.getElementById("item-price").value: 0
                                                    this.setState({pricingContainer: oldPricing});
                                                }

                                            }
                                        }}>
                                            <option value="0" selected disabled hidden> Select image index </option>
                                            {fileListForPricing.map((ele, index)=>{
                                                return (<option key={'0-'+index+1} value={index+1}>{index+1}</option>)
                                                })
                                            }
                                            
                                            
                                        </select>
                                        <div className="add-price">
                                            <span>&#8377;</span>
                                            <input type="number" placeholder="Price" min="0" id="item-price"  
                                            onChange={(ele)=>{
                                                let currIndex = document.getElementById("img-index-dropdown").value;
                                                let oldPricing = this.state.pricingContainer;
                                                if (oldPricing.hasOwnProperty(currIndex)) {
                                                    oldPricing[currIndex] = ele.target.value;
                                                    this.setState({pricingContainer: oldPricing});
                                                }
                                                
                                            }}></input>
                                        </div>
                                    </div>
                                </div>
                                :
                                ""
                            
                            }
                            <div className="check-t-c">
                                <input type="checkbox" className="check-box" id="tc-checked" />
                                <span className="t-c-line">I have read and accepted the following 
                                    <div className="btn-anc t-c-highlight" onClick={this.displaySideView.bind(this, {content: <TandCTemplate />, sureVal: true, altHeadText: "Terms of use"})}> Terms and Conditions</div>
                                </span>
                                
                            </div>
                        </section>
                        <section className="doc-btn">
                            <input type="button"
                                className="btn cancel-btn" value="Cancel"
                                onClick={this.props.showModal} />
                            <input type="submit" className="btn apply-btn" value={this.props.updatePostDetails?"Update":"Create"} 
                            onClick={this.props.updatePostDetails?this.onUpdate: this.onSubmit}/>
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



export function TandCTemplate(){
    return(
        <React.Fragment>
            <CommmunityGuidelines />
        </React.Fragment>
    )
}
export default AddPost;