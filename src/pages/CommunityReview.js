import React, { Component } from 'react';
import {ReviewCurved} from "../components/Reviews";
import "../assets/css/addpost.css";
import "../assets/css/review.css";
import { FaPencilAlt, FaPlus, 
    FaRegFrown, FaFrown,
    FaRegMeh, FaMeh,
    FaRegLaugh, FaLaugh,
    FaRegLaughWink, FaLaughWink,
    FaRegKissWinkHeart, FaKissWinkHeart,
} from 'react-icons/fa';
import {AiFillHeart} from 'react-icons/ai';
import {generateId} from '../utility/Utility.js';
import Subnav from '../components/Subnav';

import pl1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";
import StickyBoard from '../components/StickyBoard';
import Footer from '../components/Footer';
import NoContent from '../components/NoContent';

// Add review button
export class AddReviewBTN extends Component {
    state = {
        isModalOpen: false
    }

    showModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }


    render() {
        return (
            <React.Fragment>
                {this.state.isModalOpen ? <AddReviewForm showModal={this.showModal} addNewReview={this.props.addNewReview}/>
                :
                <button className="camera-cover" onClick={this.showModal}>
                    <FaPencilAlt className="camera-icon" />
                    <FaPlus className="cam-plus-below" />
                </button>
                }    

            </React.Fragment>
        );

    }

}

class AddReviewForm extends Component{
    state ={
        name: '',
        review: '',
        reaction: null,

    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    createReviewObj =() =>{
        let newRev = {
            id: generateId(), name: this.state.name? this.state.name: "Anonymous user", 
            username: "Anonymous user", designation: "Anonymous user", 
            profile_pic: pl2, cover_pic: pl1, review:this.state.review, 
            reaction: this.state.reaction}
        return newRev
    }

    selectReaction = (key) =>{
        this.setState({reaction: key})
    }

    feedToReviewBox = (rev) =>{
        document.getElementById("user-rev").value = rev;
        this.setState({review: rev})
    }

    getReviewSuggestions = () =>{
        let resultList = [];
        let suggestions = ["It's Awesome", "Need Improvements", "Good job", "Well done", "Looking Great",
                            "Try more harder"]

        suggestions.map((ele, index) =>{
            resultList.push(
            <span className="item-span suggestion-item-span" key={index} onClick={this.feedToReviewBox.bind(this, ele)}>{ele}</span>
            )
            return ele
        })
        return resultList
    }

    onPostSubmit = (e) =>{
        e.preventDefault();
        // add the review to review list
        this.props.addNewReview(this.createReviewObj());
        // reset state and form 
        this.setState({
            name: '',
            review: ''
        });
        document.getElementById("review-upload-form").reset();
        this.props.showModal();
        
    }
    
    render(){
        return(
            <React.Fragment>
                <div className="doc-form full-width">
                    <form className="img-upload-form" id="review-upload-form" onSubmit={this.onPostSubmit}>
                        <section className="doc-head">
                            <div className="top-logo">
                                <FaPencilAlt className="cam-logo" />
                            </div>

                        </section>
                        <section className="doc-body">
                            <div className="rev-doc-body">
                                <label>Name</label>
                                <input type="text" id="rev-user-name" name="name" onChange={this.onChange} />
                                <label>Drop a reaction<span className="imp-field">*</span></label>
                                <div className="reaction-palette">
                                    <div className="reaction-cube" onClick={this.selectReaction.bind(this, 'frown')}>
                                        {this.state.reaction === "frown"?
                                        <FaFrown className="reaction-icon icons-active" />
                                        :
                                        <FaRegFrown className="reaction-icon" />
                                        }
                                        
                                        <div className="reaction-text">Pathetic</div>
                                    </div>
                                    <div className="reaction-cube" onClick={this.selectReaction.bind(this, 'meh')}>
                                        {this.state.reaction === "meh"?
                                        <FaMeh className="reaction-icon icons-active " />
                                        :
                                        <FaRegMeh className="reaction-icon" />
                                        }
                                        <div className="reaction-text">It's Ok Ok</div>
                                    </div>
                                    <div className="reaction-cube" onClick={this.selectReaction.bind(this, 'laugh')}>
                                        {this.state.reaction === "laugh"?
                                        <FaLaugh className="reaction-icon icons-active " />
                                        :
                                        <FaRegLaugh className="reaction-icon" />
                                        }
                                        <div className="reaction-text">It's Good</div>
                                    </div>
                                    <div className="reaction-cube" onClick={this.selectReaction.bind(this, 'wink')}>
                                        {this.state.reaction === "wink"?
                                        <FaLaughWink className="reaction-icon icons-active " />
                                        :
                                        <FaRegLaughWink className="reaction-icon" />
                                        }
                                        <div className="reaction-text">It's Great</div>
                                    </div>
                                    <div className="reaction-cube" onClick={this.selectReaction.bind(this, 'kiss')}>
                                        {this.state.reaction === "kiss"?
                                        <FaKissWinkHeart className="reaction-icon icons-active " />
                                        :
                                        <FaRegKissWinkHeart className="reaction-icon" />
                                        }
                                        <div className="reaction-text">Oh Lovely!</div>
                                    </div>
                                </div>
                                <label>Add Review<span className="imp-field">*</span></label>
                                <textarea type="text" id="user-rev" name="review" onChange={this.onChange} 
                                placeholder="type your review ..." required/>
                                <div className="review-suggestions">{this.getReviewSuggestions()}</div>
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
            </React.Fragment>

        )
    }
}

export class CommunityReview extends Component{
    state ={
        reviews :[
            {id: 1, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2,  cover_pic: pl1,
            review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.",
            reaction: "meh"
            },
            {id: 2, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2,  cover_pic: pl1,
            review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.",
            reaction: "laugh"
            },
            {id: 3, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2,  cover_pic: pl1,
            review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.",
            reaction: "frown"
            },
            {id: 4, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2,  cover_pic: pl1,
            review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.",
            reaction: "wink"
            },            
            {id: 5, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2,  cover_pic: pl1,
            review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.",
            reaction: "kiss"
            },        
        ],
        
        reactionCount :{
            "kiss": 150,
            "wink": 63,
            "laugh": 15,
            "meh": 6,
            "frown": 12,
            "total": 246
        },
        SubNavOptions:[
            {key: "rv-1", "title": "All Reviews", "isActive": true},
            {key: "rv-2", "title": "Suggest Us", "isActive": false}
        ],
    }

    addNewReview = (record) =>{
        this.setState({
            reviews: [record , ...this.state.reviews]
        })
    }

    getNoContentDiv = (msg)=>{
        return(
            <div className="no-content-render">
                <NoContent message={msg} />
            </div>
        )

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
    
    getReactionPercent = (key) =>{
        let total = this.state.reactionCount.total;
        let percentVal = 0
        if (total > 0){
            let keyCount = this.state.reactionCount[key]
            percentVal = parseInt((keyCount /total) * 100)
        }
        return percentVal + '%'
    }

    getWeightedAvg = () =>{
        let total = this.state.reactionCount.total;
        let wavg = 0;
        if (total > 0){
            wavg = (5*this.state.reactionCount["kiss"] + 4*this.state.reactionCount["wink"] + 3 * this.state.reactionCount["laugh"] 
            + 2 * this.state.reactionCount["meh"] + 1* this.state.reactionCount["frown"]) / total
        }
        return wavg
    }

    getContent= () =>{
        let revList = [];
        this.state.SubNavOptions.map(item =>{
            if(item.title === "All Reviews" && item.isActive=== true){
                if(this.state.reviews.length === 0){
                    let msg = "No reviews yet !!!"
                    revList = this.getNoContentDiv(msg);
                }
                else{
                    this.state.reviews.map(ele =>{
                        revList.push(
                            <div className="review-box" key={ele.id}>
                                    <ReviewCurved key={ele.id} data={ele}/>
                                </div>
                        )
                        return ele 
                    })

                }
                
            }
            else if(item.title === "Suggest Us" && item.isActive=== true){
                revList = <StickyBoard />

            }
            return item
        })
        return revList
    }

    render(){
        
        
        
        let wavg = Math.round(this.getWeightedAvg() *10)/10;
        let wHeartSym = [];
        for(let i=1; i<6 ; i++){
            if(i <= parseInt(wavg) ){
                wHeartSym.push(<AiFillHeart className="reaction-icon icons-active "/>)
            }
            else{
                wHeartSym.push(<AiFillHeart className="reaction-icon"/>)
            }
        }
        
        return(
            <React.Fragment>
                <div className="review-container-head">
                    <div className="review-head-upper">
                        <div className="review-tagline">
                            <span> {this.props.headMessgae? 
                            this.props.headMessgae 
                            : 
                            "Show your love for this community"}</span> 
                            <AiFillHeart className="reaction-icon icons-active "/>
                        </div>
                        <div className="review-ratings-percent">
                            <div className="rating-heading">
                                <h4 >User Reactions</h4>
                                <div className="avg-line">
                                    <div className="w-avg">
                                        {wHeartSym}
                                    </div>
                                    <span className="w-line">{wavg} average based on {this.state.reactionCount["total"]} reviews</span>

                                </div>
                                
                            </div>
                            <div className="rating-row">
                                <FaKissWinkHeart className="reaction-icon icons-active " />
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{width: this.getReactionPercent('kiss')}}></div>
                                </div>
                                <span className="reaction-count">{this.state.reactionCount["kiss"]}</span>
                            </div>
                            <div className="rating-row">
                                <FaLaughWink className="reaction-icon icons-active " />
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{width: this.getReactionPercent('wink')}}></div>
                                </div>
                                <span className="reaction-count">{this.state.reactionCount["wink"]}</span>
                            </div>
                            <div className="rating-row">
                                <FaLaugh className="reaction-icon icons-active " />
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{width: this.getReactionPercent('laugh')}}></div>
                                </div>
                                <span className="reaction-count">{this.state.reactionCount["laugh"]}</span>
                            </div>
                            <div className="rating-row">
                                <FaMeh className="reaction-icon icons-active " />
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{width: this.getReactionPercent('meh')}}></div>
                                </div>
                                <span className="reaction-count">{this.state.reactionCount["meh"]}</span>
                            </div>
                            <div className="rating-row">
                                <FaFrown className="reaction-icon icons-active " />
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{width: this.getReactionPercent('frown')}}></div>
                                </div>
                                <span className="reaction-count">{this.state.reactionCount["frown"]}</span>
                            </div>
                        </div>
                    </div>
                    {this.props.showSubNav=== false?
                    ""
                    :
                    <div className="review-head-lower">
                        <Subnav subNavList={this.state.SubNavOptions} selectSubMenu={this.selectSubNavMenu}/>
                    </div>
                    }
                    
                </div>
                <div className="review-container">
                    {this.getContent()}
                </div>
                {this.state.SubNavOptions[0].isActive?
                <AddReviewBTN addNewReview = {this.addNewReview}/>
                :
                ""
                }
                <Footer />
                
            </React.Fragment>
        )
    }
}


export default CommunityReview;