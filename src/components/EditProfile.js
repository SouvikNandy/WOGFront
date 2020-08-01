import React, { Component } from 'react';
import '../assets/css/editprofile.css';
import Subnav from '../components/Subnav';
import {FaCameraRetro} from 'react-icons/fa';
import DateTimePicker from 'react-datetime-picker';
import {FiGlobe} from 'react-icons/fi';
import {FaFacebookSquare, FaInstagram, FaYoutube, FaPinterest} from 'react-icons/fa';

export class EditProfile extends Component {
    state ={
        SubNavOptions:[
            {key: "E-1", title: "Basic", isActive: true},
            {key: "E-2", title: "Social", isActive: false},
            {key: "E-3", title: "Skills & Teams", isActive: false},

        ],
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
                                <FaCameraRetro  className="cam-icon"/>
                            </span>
                            <img className="e-cover-img" src={data.cover_pic} alt="" />
                            <div className="prof-img-section">
                                <div className="e-user-img-back">
                                    <img className="e-user-img" src={data.profile_pic} alt="" />
                                    <span className="edit-pic">
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
                                <input type="text" className="inp-box" defaultValue={data.hometown} placeholder="Add your hometown"></input>
                            </div>

                            <div className="inline-content">
                                <label>Current City</label>
                                <input type="text" className="inp-box" defaultValue={data.currentcity} placeholder="Add your current city"></input>
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
               


            };
            // else if(ele.title === "Skills & Teams" && ele.isActive === true){

            // };
            return ele
        })
        return contentBlock
    }

    render() {
        return (
            <div className="edit-profile-overlay">
                <div className="edit-profile-container">
                    <div className="edit-options">
                        <Subnav subNavList={this.state.SubNavOptions} selectSubMenu={this.selectSubNavMenu}/>
                    </div>
                    <div className="content-div">
                        {this.pageContent()}
                    </div>
                    <div className="edit-actions">
                        <button className="btn cancel-btn">close</button>
                        <button className="btn apply-btn">Next</button>

                    </div>

                </div>
                
            </div>
        )
    }
}

export default EditProfile
