import React, { Component } from 'react';
import '../../assets/css/editprofile.css';
import Subnav from '../Navbar/Subnav';
import {FaCameraRetro} from 'react-icons/fa';
import DateTimePicker from 'react-datetime-picker';
import {FiGlobe} from 'react-icons/fi';
import {AiFillCloseCircle, AiFillPlusCircle} from 'react-icons/ai';
import {FaFacebookSquare, FaInstagram, FaYoutube, FaPinterest, FaUserCircle} from 'react-icons/fa';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import ImgCompressor from '../../utility/ImgCompressor';
import SideBar from "../SideBar";
import IndianCityList from '../IndianCityList';
import FriendList from './FriendList';
import TagUser from '../Profile/TagUser';
import {defaultCoverPic} from '../../utility/userData';
import HTTPRequestHandler from '../../utility/HTTPRequests';
import { saveInStorage, retrieveFromStorage } from '../../utility/Utility';

export class EditProfile extends Component {
    state ={
        SubNavOptions:[
            {key: "E-1", title: "Basic", isActive: true},
            {key: "E-2", title: "Social", isActive: false},
            {key: "E-3", title: "Skills & Teams", isActive: false},

        ],
        // sidebar states
        showSideView: false,
        sideBarHead: true,
        searchBarRequired: false,
        sideViewContent: [],
        altHeadText : null,

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
        social : {
            "web": '',
            "facebook": '',
            "instagram": '',
            "youtube": '',
            "pinterest": ''
        },

        // skills
        profession: '',
        skills: [],
        teams: [],

        dataset : JSON.parse(retrieveFromStorage("user_data")),

    }

    onChange =(e) =>{
        if(e.target.name.startsWith("social")){
            let keyset = e.target.name.split("-");
            let social = this.state.social;
            social[keyset[1]] = e.target.value
            this.setState({
                social : social
            })
        }
        else{
            this.setState({
                [e.target.name]: e.target.value
            })

        }
        
    }

    updateDob = date => this.setState({ birthday: date })


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
            }),
            // on changing tab close the sidebar / clear previous disabledFields
            showSideView : false,
            disabledFields: []
        })
    }

    displaySideView = ({content, sureVal, altHeadtext=null}) =>{
        let stateVal = !this.state.showSideView
        if (sureVal){
            stateVal = sureVal
        }

        this.setState({
            showSideView: stateVal,
            sideBarHead: true,
            altHeadtext: altHeadtext
            

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
        console.log("uploadPicture", e.target.files, imgKey)
        ImgCompressor(e, this.makeUploadRequest, imgKey)
    }

    makeUploadRequest=(compressedFile, imgKey)=>{
        let url = 'api/v1/user-profile/'
        let formData = new FormData();
        formData.append(imgKey, compressedFile); 
        HTTPRequestHandler.post(
            {url:url, requestBody: formData, includeToken:true, uploadType: 'file', callBackFunc: this.addFileToState.bind(this, compressedFile, imgKey), errNotifierTitle:"Update failed !"})

    }
    addFileToState = (compressedFile, imgKey, data) =>{
        console.log("addFileToState", data);
        // if (imgKey === "profile_pic"){
        //     this.setState({profile_pic: URL.createObjectURL(compressedFile)})
        // }
        // else if(imgKey === "cover_pic"){
        //     this.setState({cover_pic: URL.createObjectURL(compressedFile)})
        // }
    }



    tagMembers = (record) =>{
        this.setState({
            teams : [...this.state.teams, record]
        })

    }
    onRemoveMember = (idx, removeTagOnly=false) => {
        if(removeTagOnly===true){
            this.setState({
                teams: [...this.state.teams.filter(item => item.id !== idx)],
            });
        }
        else{
            this.setState({
                teams: [...this.state.teams.filter(item => item.id !== idx)],
                sideViewContent: [...this.state.sideViewContent.filter(item => item.props.data.id !== idx)]
            });
        }
        

    }
    addSkills = () =>{
        let ele = document.getElementById("skill-keywords")
        let valueset = ele.value;
        if (valueset === ""){return false}
        valueset = valueset.split(',');
        console.log("valueset.length", valueset.length, valueset)
        this.setState({skills: [...this.state.skills, ...valueset]});
        ele.value = "";
    }
    removeSkills = (ele) =>{
        this.setState({skills: this.state.skills.filter(item => item!== ele)})
    }

    pageContent = () =>{
        let contentBlock = [];
        let data = this.state.dataset;
        let coverpic = data.cover_pic? data.cover_pic: defaultCoverPic();
        this.state.SubNavOptions.map(ele=>{
            if(ele.title === "Basic" && ele.isActive === true){
                contentBlock.push(
                    <React.Fragment>
                        <div className="upld-pic">
                            <span className="edit-coverpic">
                                <input type="file" className="pic-uploader" onChange={ e => this.uploadPicture(e, 'cover_pic')}/>
                                <FaCameraRetro  className="cam-icon"/>
                            </span>
                            <img className="e-cover-img" src={this.state.cover_pic? this.state.cover_pic:coverpic} alt="" />
                            <div className="prof-img-section">
                                <div className="e-user-img-back">
                                    {(this.state.profile_pic || data.profile_pic )?
                                    <img className="e-user-img" 
                                    src={this.state.profile_pic? this.state.profile_pic: data.profile_pic} alt="" />
                                    :
                                    <FaUserCircle className="e-user-img default-user-logo" />
                                    }
                                    
                                    <span className="edit-pic">
                                        <input type="file" className="pic-uploader" onChange={ e => this.uploadPicture(e, 'profile_pic')}/>
                                        <FaCameraRetro  className="cam-icon"/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="basic-details">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" defaultValue={data.name} 
                            name="name" onChange={this.onChange}></input>
                            <div className="details-inline">
                                <div className="inline-content">
                                    <label>Username</label>
                                    <input type="text" placeholder="Enter a username" value={data.username}
                                    name="username" onChange={this.onChange} ></input>
                                </div>
                                <div className="inline-content">
                                    <label>Email</label>
                                    <input type="text" value={data.email} placeholder="Enter a email"></input>
                                </div>
                            </div>
                            <label>Bio</label>
                            <textarea placeholder="Let others know about you, add a bio" 
                            defaultValue={data.profile_data && data.profile_data.bio? data.profile_data.bio: ""}
                            name="bio" onChange={this.onChange}></textarea>
                            

                        </div>

                    </React.Fragment>
                    
                )

            }
            else if (ele.title === "Social" && ele.isActive === true){
                console.log(data);
                let dob = ''
                if (data.profile_data.dob){
                    dob = new Date(data.profile_data.birthday)
                }
                else if (this.state.birthday){
                    dob = this.state.birthday
                }
                else{
                    dob = new Date()

                }
                
                contentBlock.push(
                    <div className="social-details">
                        <div className="details-inline">
                            <div className="inline-content">
                                <label>Pick your Birthday</label>
                                <DateTimePicker
                                    disableClock={true}
                                    format={"dd-MM-y"}
                                    value={dob}
                                    name="dob"
                                    onChange={this.updateDob}
                                />
                            </div>
                            
                        </div>
                        <div className="details-inline">
                            <div className="inline-content">
                                <label>Home Town</label>
                                <input type="text" className="inp-box" defaultValue={data.profile_data.hometown} placeholder="Add your hometown"
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
                                <input type="text" className="inp-box" defaultValue={data.profile_data.currentcity} placeholder="Add your current city"
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
                                <input type="text" defaultValue={data.profile_data.social?data.profile_data.social["web"]:""} 
                                placeholder="Add your website" name="social-web" onChange={this.onChange}/>
                            </div>
                            <div className="s-link">
                                <label> <FaFacebookSquare /> </label>
                                <input type="text" defaultValue={data.profile_data.social?data.profile_data.social["facebook"]:""} 
                                placeholder="Add your facebook account" name="social-facebook" onChange={this.onChange}/>
                            </div>

                            <div className="s-link">
                                <label> <FaInstagram /> </label>
                                <input type="text" defaultValue={data.profile_data.social?data.profile_data.social["instagram"]:""} 
                                placeholder="Add your instagram account" name="social-instagram" onChange={this.onChange}/>
                            </div>
                            <div className="s-link">
                                <label> <FaYoutube /> </label>
                                <input type="text" defaultValue={data.profile_data.social?data.profile_data.social["youtube"]:""} 
                                placeholder="Add your youtube channel" name="social-youtube" onChange={this.onChange} />
                            </div>

                            <div className="s-link">
                                <label> <FaPinterest /> </label>
                                <input type="text" defaultValue={data.profile_data.social?data.profile_data.social["pinterest"]:""} 
                                placeholder="Add your pinterest account" name="social-pinterest" onChange={this.onChange} />
                            </div>
                        </div>
                    </div>
                        
                    )
            }
            else if(ele.title === "Skills & Teams" && ele.isActive === true){
                let options = ['Photographer', 'Editor', 'Makeup Artist']
                let skillList = [];
                this.state.skills.map(item => {
                    skillList.push(
                        <span className="item-span" key={item}>
                            <span>{item}</span>
                            <AiFillCloseCircle className="close-btn close-img " onClick={this.removeSkills.bind(this, item)} />
    
                        </span>)
                    return item
                })

                let tagList = [];
                let existingList = [];
                let maxCount = 5;

                // all members list
                this.state.teams.map(item=>{
                    existingList.push(
                        <TagUser key={item.id} data={item} onRemoveMember={this.onRemoveMember}/>
                    )
                    return item
                })

                if (this.state.teams.length > maxCount){
                    let tagUsers =  this.state.teams
                    let remainingTagsCount = tagUsers.length - maxCount
                    for(let i=0; i<maxCount; i++){
                        tagList.push(
                        <span key={tagUsers[i].id} className="img-span">
                            <img className="tag-img" src={tagUsers[i].profile_pic} alt={tagUsers[i].username}/>
                        </span>)
                    }
                    tagList.push(<span key="tag-img-count" className="tag-img-count" 
                    onClick={this.displaySideView.bind(this, {content: existingList, sureVal: true, altHeadtext: "Tagged Users"})}>+{remainingTagsCount}</span>)
                }
                
                else{
                    this.state.teams.map(ele => {
                        tagList.push(
                        <span key={ele.id} className="img-span">
                            <img className="tag-img" src={ele.profile_pic} alt={ele.username}/>
                        </span>
                        )
                        return ele
                    })
                }
                if(this.state.teams.length > 0){
                    tagList.push(
                        <button key="review-tags" className="btn-anc review-tags" 
                        onClick={this.displaySideView.bind(this, {content: existingList, sureVal: true, altHeadtext: "Tagged users"})}>Review all</button>
                        ) 

                }
                    
                contentBlock.push(
                    <div className="skills-section">
                        <div className="select-profession">
                            <label>Select your profession</label>
                            <Dropdown options={options} placeholder="Select an option" />                          
                        </div>
                        <label>Enlist your other skills</label>
                        <span className="info-text">
                            You can enlist other 5 skills you have. <br/>
                            providing other skills increase your chances to apprear on other peoples search
                        </span>
                        <div className="skill-keywords">
                            <span className="added-skills-text">Added Skills</span>
                            {skillList}
                        </div>
                        <div className="add-skills">
                            <input type="text" id="skill-keywords" placeholder="Add skills to display"></input>
                            <AiFillPlusCircle className="add-skills-btn" onClick={this.addSkills} />

                        </div>
                        
                        <label>Add teams you are associated with</label>
                        <span className="info-text">
                            You can only associate with teams you follow. <br/>
                        </span>
                        <div className="skill-keywords">
                            <span className="added-skills-text">Added Teams</span>
                            {tagList}
                        </div>
                        <input type="text" id="memo" name="memo" placeholder="Search Teams / organisations" 
                            onSelect={this.chooseOptions.bind(
                                this, 
                                'memo',
                                <FriendList 
                                    displaySideView={this.displaySideView} searchPlaceHolder={"Search For Friends ..."} 
                                    populateOnDestinationID={'memo'} tagMembers={this.tagMembers}
                                    currentTags={this.state.teams}
                                    currentTagIDs={this.state.teams.map(ele => ele.id )}
                                    onRemoveMember={this.onRemoveMember}
                                />)}
                            />

                    </div>
                )

            };
            return ele
        })
        return contentBlock
    }

    UpdateDetails =() =>{
        let activeTab = this.state.SubNavOptions.filter(ele=> ele.isActive ===true)[0]
        let url = 'api/v1/user-profile/';

        let requestBody = {"profile_data": {} }
        if(activeTab.key === "E-1"){

            if (this.state.name){
                requestBody["name"] = this.state.name;
            }
            else if(this.state.username){
                requestBody["username"] = this.state.username
            }
            else if(this.state.bio){
                requestBody['profile_data']['bio'] = this.state.bio

            }
            HTTPRequestHandler.post(
                {url:url, requestBody: requestBody, includeToken:true, callBackFunc: this.onSuccessfulUpdate, errNotifierTitle:"Update failed !"})


        }
        else if(activeTab.key === "E-2"){
            requestBody['profile_data']={'social':{}}
           if(this.state.birthday){
            requestBody['profile_data']['birthday'] = this.state.birthday.getMonth() + '-' + this.state.birthday.getDate() + '-' + this.state.birthday.getFullYear();
           }

           requestBody['profile_data']['hometown'] = document.getElementById('hometown').value;
           requestBody['profile_data']['currentcity'] = document.getElementById('currentcity').value;
           for (let s in this.state.social){
            if(this.state.social[s]){
                requestBody['profile_data']['social'][s] = this.state.social[s]
               } 

           }
           HTTPRequestHandler.post(
            {url:url, requestBody: requestBody, includeToken:true, callBackFunc: this.onSuccessfulUpdate, errNotifierTitle:"Update failed !"})

        }
        else if(activeTab.key === "E-3"){
            
        }
    }

    onSuccessfulUpdate = (data) =>{
        console.log(data.data)
        saveInStorage("user_data",JSON.stringify(data.data));
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
                        <button className="btn apply-btn" onClick={this.UpdateDetails}>save</button>

                    </div>

                </div>
                
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
            </React.Fragment>
        )
    }
}

export default EditProfile
