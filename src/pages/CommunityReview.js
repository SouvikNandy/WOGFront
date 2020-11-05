import React, { Component } from 'react';
import {ReviewCurved} from "../components/Review/Reviews";
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
import {checkNotEmptyObject, generateId, getCurrentTimeInMS, isAuthenticated} from '../utility/Utility.js';
import Subnav from '../components/Navbar/Subnav';
import StickyBoard from '../components/Review/StickyBoard';
import Footer from '../components/Footer';
import NoContent from '../components/NoContent';
import { AddUserReviewsAPI, DeleteUserReviewsAPI, UpdateUserReviewsAPI, UserReviewsAPI } from '../utility/ApiSet';
import Paginator from '../utility/Paginator';
import OwlLoader from '../components/OwlLoader';
import { createFloatingNotification } from '../components/FloatingNotifications';
import getUserData from '../utility/userData';

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
                {this.state.isModalOpen ? 
                <AddReviewForm showModal={this.showModal} addNewReview={this.props.addNewReview} previousReview={this.props.previousReview}
                username={this.props.username} profession={this.props.profesion} profile_pic={this.props.profile_pic}/>
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
        text: '',
        reaction: null,

    }
    componentDidMount(){
        if(this.props.previousReview){
            this.setState({
                reaction: this.props.previousReview.review.reaction,
                text: this.props.previousReview.review.text
            })
        }
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    createReviewObj =() =>{
        let newRev = ''
        if (this.props.previousReview){
            newRev = this.props.previousReview
            newRev.created_at = getCurrentTimeInMS()
            newRev.review = { text: this.state.text, reaction: this.state.reaction}

        }
        else{
            newRev = {
                id: generateId(), 
                created_at: getCurrentTimeInMS(),
                provider: {
                    username: this.props.username, 
                    profession: this.props.profession, 
                    profile_pic: this.props.profile_pic,
                },
                review: { text: this.state.text, reaction: this.state.reaction},
                edit_perm: true, delete_perm: true
            }
        }
        return newRev
    }

    selectReaction = (key) =>{
        this.setState({reaction: key})
    }

    feedToReviewBox = (rev) =>{
        document.getElementById("user-rev").value = rev;
        this.setState({text: rev})
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

    validate = () =>{
        if(!this.state.reaction){
            createFloatingNotification("error", "You must choose a Reaction", "Drop a rection about how did you find this user's creativity")
            return false
        }
        
        if(this.props.previousReview && this.state.reaction === this.props.previousReview.review.reaction && this.state.text === this.props.previousReview.review.text){
            return "NOT UPDATED"
        }
        return true
    }

    onPostSubmit = (e) =>{
        e.preventDefault();
        let _validated = this.validate()
        if(!_validated) return false
        if(_validated === "NOT UPDATED"){
            // reduce backend hit
            document.getElementById("review-upload-form").reset();
            this.props.showModal();
        }
        // add the review to review list
        this.props.addNewReview(this.createReviewObj());
        // reset state and form 
        this.setState({
            text: '',
            reaction: null,
        });
        document.getElementById("review-upload-form").reset();
        this.props.showModal();
        
    }
    
    render(){
        console.log("this.props.previousReview", this.props.previousReview)
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
                                <label>Drop a reaction<span className="imp-field">*</span></label>
                                <ReactionPalette selectReaction={this.selectReaction} reaction={this.state.reaction} />
                                <label>Add Review</label>
                                <textarea type="text" id="user-rev" name="text" onChange={this.onChange} 
                                placeholder="type your review ..." defaultValue={this.props.previousReview? this.props.previousReview.review.text: ""}/>
                                <div className="review-suggestions">{this.getReviewSuggestions()}</div>
                            </div>

                        </section>
                        <section className="doc-btn">
                            <input type="button"
                                className="main-btn cancel-btn" value="Cancel"
                                onClick={this.props.showModal} />
                            <input type="submit" className="main-btn apply-btn" value={this.props.previousReview? "Update":"Create"} />
                        </section>
                    </form>

                </div>
            </React.Fragment>

        )
    }
}

export class CommunityReview extends Component{
    state ={
        reviews : null,
        reaction_count : {},
        self_review: {},
        SubNavOptions:[
            {key: "rv-1", "title": "All Reviews", "isActive": true},
            {key: "rv-2", "title": "Suggest Us", "isActive": false}
        ],
        isAuth: isAuthenticated(),
        currUser: getUserData(),
        paginator: null,
        isFetching: false,
        eventListnerRef: null,

    }

    componentDidMount(){
        // if requested for user then fetch user reviews
        // if requested for platform then fetch platform reviews
        // else no reviews avaliable 
        if (this.props.username){
            // fetch for user
            UserReviewsAPI(this.props.username, this.updateStateOnAPIcall)
        }
        else{
            // no reviews
            this.setState({reviews: []})
        }
        let eventListnerRef = this.handleScroll.bind(this);
        this.setState({
            eventListnerRef: eventListnerRef
        })
        window.addEventListener('scroll', eventListnerRef);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        
    }

    updateStateOnAPIcall = (data)=>{
        // console.log("data", data)
        this.setState({
            reviews : data.results,
            reaction_count: data.reaction_count,
            self_review: data.self_review,
            paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        })
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            feeds:[...this.state.feeds, ...results],
            isFetching: false
        })
    }

    addNewReview = (record) =>{
        if(!checkNotEmptyObject(this.state.self_review)){
            AddUserReviewsAPI(this.props.username, record, this.addRreviewOnSuccess.bind(this, record))
        }
        else{
            UpdateUserReviewsAPI(this.props.username, record, this.addRreviewOnSuccess.bind(this, record))
        }
        
    }
    addRreviewOnSuccess = (record, response) =>{
        let reaction_count = this.state.reaction_count;
        reaction_count[record.review.reaction]++;
        if (record.review.text){
            this.setState({
                self_review: record,
                reaction_count: reaction_count
            })
        }
        else{
            this.setState({
                reaction_count: reaction_count
            })

        }
    }

    removeReview = (revId) =>{
        DeleteUserReviewsAPI(this.props.username, revId, this.removeRreviewOnSuccess)
    }
    removeRreviewOnSuccess = (response) =>{
        let reaction_count = this.state.reaction_count;
        reaction_count[this.state.self_review.review.reaction]--;

        this.setState({
            self_review: {},
            reaction_count: reaction_count
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
        let total = this.state.reaction_count.total;
        let percentVal = 0
        if (total > 0){
            let keyCount = this.state.reaction_count[key]
            percentVal = parseInt((keyCount /total) * 100)
        }
        return percentVal + '%'
    }

    getWeightedAvg = () =>{
        let total = this.state.reaction_count["kiss"] + this.state.reaction_count["wink"] + this.state.reaction_count["laugh"] + this.state.reaction_count["meh"] + this.state.reaction_count["frown"];
        let wavg = 0;
        if (total > 0){
            wavg = (5*this.state.reaction_count["kiss"] + 4* this.state.reaction_count["wink"] + 3 * this.state.reaction_count["laugh"] 
            + 2 * this.state.reaction_count["meh"] + 1* this.state.reaction_count["frown"]) / total
        }
        return wavg
    }

    getContent= () =>{
        let revList = [];
        this.state.SubNavOptions.map(item =>{
            if(item.title === "All Reviews" && item.isActive=== true){
                if(this.state.reviews.length === 0 && !checkNotEmptyObject(this.state.self_review)){
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
                revList = <StickyBoard username={this.state.currUser.username} isAuth={this.state.isAuth}/>

            }
            return item
        })
        return revList
    }

    render(){
        if(!this.state.reviews){
            return(
            <div className="review-container-head">
                <OwlLoader />

            </div>)
        }
        let wavg = Math.round(this.getWeightedAvg() *10)/10;
        let wHeartSym = [];
        for(let i=1; i<6 ; i++){
            if(i <= parseInt(wavg) ){
                wHeartSym.push(<AiFillHeart key={i} className="reaction-icon icons-active "/>)
            }
            else{
                wHeartSym.push(<AiFillHeart key={i} className="reaction-icon"/>)
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
                                    <span className="w-line">{wavg} average based on {this.state.reaction_count["total"]} reviews</span>

                                </div>
                                
                            </div>
                            <div className="rating-div">
                                <div className="rating-cube toolpit">
                                    <FaRegKissWinkHeart className="reaction-icon icons-active " />
                                    <span className="reaction-count">{this.state.reaction_count["kiss"]}</span>
                                    <span className="tooltiptext">Oh Lovely!</span>
                                </div>
                                <div className="rating-cube toolpit">
                                    <FaRegLaughWink className="reaction-icon icons-active " />
                                    <span className="reaction-count">{this.state.reaction_count["wink"]}</span>
                                    <span className="tooltiptext">It's Great</span>
                                </div>
                                <div className="rating-cube toolpit">
                                    <FaRegLaugh className="reaction-icon icons-active " />
                                    <span className="reaction-count">{this.state.reaction_count["laugh"]}</span>
                                    <span className="tooltiptext">It's Good</span>
                                </div>
                                <div className="rating-cube toolpit">
                                    <FaRegMeh className="reaction-icon icons-active " />
                                    <span className="reaction-count">{this.state.reaction_count["meh"]}</span>
                                    <span className="tooltiptext">It's Ok Ok</span>
                                </div>
                                <div className="rating-cube toolpit">
                                    <FaRegFrown className="reaction-icon icons-active " />
                                    <span className="reaction-count">{this.state.reaction_count["frown"]}</span>
                                    <span className="tooltiptext">Pathetic</span>
                                </div>
                               
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
                    {this.state.SubNavOptions[0].isActive && checkNotEmptyObject(this.state.self_review) && this.state.self_review.review.text?
                        <div className="self-rev">
                            <ReviewCurved key={this.state.self_review.id} data={this.state.self_review} removeReview={this.removeReview}/>
                        </div>
                        :
                        ""
                    }
                    {this.getContent()}
                </div>
                {this.state.SubNavOptions[0].isActive && this.state.isAuth && !this.props.isSelf?
                <AddReviewBTN addNewReview = {this.addNewReview}
                previousReview ={checkNotEmptyObject(this.state.self_review)? this.state.self_review: null }
                username={this.state.currUser.username} 
                profession={this.state.currUser.profile_data && this.state.currUser.profile_data.profession? 
                    this.state.currUser.profile_data.profession: ""}
                profile_pic={this.state.currUser.profile_data && this.state.currUser.profile_data.profile_pic?
                    this.state.currUser.profile_data.profile_pic: ""}/>
                :
                ""
                }
                {!this.state.paginator || !this.state.paginator.next?
                    <Footer />
                :
                ""
                }
                
                
            </React.Fragment>
        )
    }
}


export function ReactionPalette(props){
    return(
        <div className="reaction-palette">
            <div className="reaction-cube" onClick={ () => props.selectReaction('frown')}>
                {props.reaction === "frown"?
                <FaFrown className="reaction-icon icons-active" />
                :
                <FaRegFrown className="reaction-icon" />
                }
                
                <div className="reaction-text">Pathetic</div>
            </div>
            <div className="reaction-cube" onClick={ () => props.selectReaction('meh')}>
                {props.reaction === "meh"?
                <FaMeh className="reaction-icon icons-active " />
                :
                <FaRegMeh className="reaction-icon" />
                }
                <div className="reaction-text">It's Ok Ok</div>
            </div>
            <div className="reaction-cube" onClick={() => props.selectReaction('laugh')}>
                {props.reaction === "laugh"?
                <FaLaugh className="reaction-icon icons-active " />
                :
                <FaRegLaugh className="reaction-icon" />
                }
                <div className="reaction-text">It's Good</div>
            </div>
            <div className="reaction-cube" onClick={() => props.selectReaction('wink')}>
                {props.reaction === "wink"?
                <FaLaughWink className="reaction-icon icons-active " />
                :
                <FaRegLaughWink className="reaction-icon" />
                }
                <div className="reaction-text">It's Great</div>
            </div>
            <div className="reaction-cube" onClick={() =>props.selectReaction('kiss')}>
                {props.reaction === "kiss"?
                <FaKissWinkHeart className="reaction-icon icons-active " />
                :
                <FaRegKissWinkHeart className="reaction-icon" />
                }
                <div className="reaction-text">Oh Lovely!</div>
            </div>
        </div>
    )
}

export default CommunityReview;