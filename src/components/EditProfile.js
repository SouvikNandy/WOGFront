import React, { Component } from 'react';
import '../assets/css/editprofile.css';
import Subnav from '../components/Subnav';
import {FaCameraRetro} from 'react-icons/fa';
import DateTimePicker from 'react-datetime-picker';
import {FiGlobe} from 'react-icons/fi';
import {FaFacebookSquare, FaInstagram, FaYoutube, FaPinterest} from 'react-icons/fa';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import ImgCompressor from '../utility/ImgCompressor';
import SideBar from "./SideBar";
import IndianCityList from '../components/IndianCityList';

export class EditProfile extends Component {
    state ={
        SubNavOptions:[
            {key: "E-1", title: "Basic", isActive: false},
            {key: "E-2", title: "Social", isActive: false},
            {key: "E-3", title: "Skills & Teams", isActive: true},

        ],
        // sidebar states
        showSideView: false,
        sideBarHead: true,
        searchBarRequired: false,
        sideViewContent: [],

        // diabled fields
        disabledFields: [],

        // basic details
        profile_pic: '',
        cover_pic: '',
        name: '',
        username: '',
        bio: '',

        // social details
        birthday: '',
        hometown: '',
        currentcity: '',
        social_handles : {
            "web": '',
            "facebook": '',
            "instagram": '',
            "youtube": '',
            "pinterest": ''
        },

        // skills
        profession: '',
        skills: [],
        teams: []


    }

    selectSubNavMenu = (key) =>{
        this.setState({
            SubNavOptions: this.state.SubNavOptions.map(item=>{
                if(key=== item.key){
                    item.isActive = true;
                }
                else{
                    item.isActive = false;
                }
                return item
            })
        })
    }

    displaySideView = ({content, sureVal}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            sideBarHead: true,
            

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

    uploadPicture =(e, imgKey) =>{
        console.log(e.target.files, imgKey)
        ImgCompressor(e, this.addFileToState, imgKey)
    }
    addFileToState = (compressedFile, imgKey) =>{
        if (imgKey === "profile_pic"){
            this.setState({profile_pic: URL.createObjectURL(compressedFile)})
        }
        else if(imgKey === "cover_pic"){
            this.setState({cover_pic: URL.createObjectURL(compressedFile)})
        }
    }

    pageContent = () =>{
        let contentBlock = [];
        console.log(this.props);
        let data = this.props.data;
        this.state.SubNavOptions.map(ele=>{
            if(ele.title === "Basic" && ele.isActive === true){
                contentBlock.push(
                    <React.Fragment>
                        <div className="upld-pic">
                            <span className="edit-coverpic">
                                <input type="file" className="pic-uploader" onChange={ e => this.uploadPicture(e, 'cover_pic')}/>
                                <FaCameraRetro  className="cam-icon"/>
                            </span>
                            <img className="e-cover-img" src={this.state.cover_pic? this.state.cover_pic:data.cover_pic} alt="" />
                            <div className="prof-img-section">
                                <div className="e-user-img-back">
                                    <img className="e-user-img" 
                                    src={this.state.profile_pic? this.state.profile_pic: data.profile_pic} alt="" />
                                    <span className="edit-pic">
                                        <input type="file" className="pic-uploader" onChange={ e => this.uploadPicture(e, 'profile_pic')}/>
                                        <FaCameraRetro  className="cam-icon"/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="basic-details">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" defaultValue={data.name}></input>
                            <div className="details-inline">
                                <div className="inline-content">
                                    <label>Username</label>
                                    <input type="text" placeholder="Enter a username" value={data.username}></input>
                                </div>
                                <div className="inline-content">
                                    <label>Email</label>
                                    <input type="text" value={data.email} placeholder="Enter a email"></input>
                                </div>
                            </div>
                            <label>Bio</label>
                            <textarea placeholder="Let others know about you, add a bio" defaultValue={data.bio}></textarea>
                            

                        </div>

                    </React.Fragment>
                    
                )

            }
            else if (ele.title === "Social" && ele.isActive === true){
                contentBlock.push(
                    <div className="social-details">
                        <div className="details-inline">
                            <div className="inline-content">
                                <label>Pick your Birthday</label>
                                <DateTimePicker
                                    disableClock={true}
                                    format={"dd-MM-y"}
                                    value={new Date()}
                                />
                            </div>
                            
                        </div>
                        <div className="details-inline">
                            <div className="inline-content">
                                <label>Home Town</label>
                                <input type="text" className="inp-box" defaultValue={data.hometown} placeholder="Add your hometown"
                                name="hometown" id="hometown"
                                onSelect={this.chooseOptions.bind(
                                    this, 
                                    'hometown',
                                    <IndianCityList 
                                        displaySideView={this.displaySideView} searchPlaceHolder={"Find a location ..."} 
                                        populateOnDestinationID={'hometown'}
                                    />
                                )}></input>
                            </div>

                            <div className="inline-content">
                                <label>Current City</label>
                                <input type="text" className="inp-box" defaultValue={data.currentcity} placeholder="Add your current city"
                                name="currentcity" id="currentcity"
                                 onSelect={this.chooseOptions.bind(
                                    this, 
                                    'currentcity',
                                    <IndianCityList 
                                        displaySideView={this.displaySideView} searchPlaceHolder={"Find a location ..."} 
                                        populateOnDestinationID={'currentcity'}
                                    />
                                )}
                                ></input>
                            </div>

                        </div>
                        <div className="social-handles">
                            <label>Add your Social handles</label>
                            <div className="s-link">
                                <label> <FiGlobe /> </label>
                                <input type="text" defaultValue={data.social_handles["web"]} placeholder="Add your website" />
                            </div>
                            <div className="s-link">
                                <label> <FaFacebookSquare /> </label>
                                <input type="text" defaultValue={data.social_handles["facebook"]} placeholder="Add your facebook account" />
                            </div>

                            <div className="s-link">
                                <label> <FaInstagram /> </label>
                                <input type="text" defaultValue={data.social_handles["instagram"]} placeholder="Add your instagram account" />
                            </div>
                            <div className="s-link">
                                <label> <FaYoutube /> </label>
                                <input type="text" defaultValue={data.social_handles["youtube"]} placeholder="Add your youtube channel" />
                            </div>

                            <div className="s-link">
                                <label> <FaPinterest /> </label>
                                <input type="text" defaultValue={data.social_handles["pinterest"]} placeholder="Add your pinterest account" />
                            </div>
                        </div>
                    </div>
                        
                    )
            }
            else if(ele.title === "Skills & Teams" && ele.isActive === true){
                let options = ['Photographer', 'Editor', 'Makeup Artist']
                contentBlock.push(
                    <div className="skills-section">
                        <div className="select-profession">
                            <label>Select your profession</label>
                            <Dropdown options={options} placeholder="Select an option" />                          
                        </div>
                        <label>Enlist your skills here</label>
                        <textarea></textarea>
                        <label>Add teams you are associated with</label>

                    </div>
                )

            };
            return ele
        })
        return contentBlock
    }

    render() {
        return (
            <React.Fragment>
            <div className={this.state.showSideView? "edit-profile-overlay with-side-width": "edit-profile-overlay full-width"}>
                <div className="edit-profile-container">
                    <div className="edit-options">
                        <Subnav subNavList={this.state.SubNavOptions} selectSubMenu={this.selectSubNavMenu}/>
                    </div>
                    <div className="content-div">
                        {this.pageContent()}
                    </div>
                    <div className="edit-actions">
                        <button className="btn cancel-btn" onClick={this.props.closeModal}>close</button>
                        <button className="btn apply-btn">save</button>

                    </div>

                </div>
                
            </div>
            {this.state.showSideView?
                <div className="form-side-bar-view side-bar-view-active">
                    <SideBar displaySideView={this.displaySideView} content={this.state.sideViewContent} 
                    searchPlaceHolder={this.state.searchPlaceHolder} sideBarHead={this.state.sideBarHead}
                    searchBarRequired={this.state.searchBarRequired}/>
                </div>
                :
                <div className="form-side-bar-view"></div>
            }
            </React.Fragment>
        )
    }
}

export default EditProfile
