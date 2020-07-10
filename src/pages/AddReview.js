import React, { Component } from 'react';
import {ReviewCurved} from "../components/Reviews";
import "../assets/css/addpost.css";
import "../assets/css/review.css";
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import {generateId} from '../utility/Utility.js';

import pl1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";

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
        review: ''
    }
    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    createReviewObj =() =>{
        let newRev = {id: generateId(), name: this.state.name, username: "Anonymous user", designation: "Anonymous user", profile_pic: pl2, review:this.state.review, cover_pic: pl1}
        return newRev
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
                                <label>Description<span className="imp-field">*</span></label>
                                <textarea type="text" id="user-rev" name="review" onChange={this.onChange} required/>
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

export class AddReview extends Component{
    state ={
        reviews :[
            {id: 1, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 2, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 3, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 4, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 5, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
        ]
    }

    addNewReview = (record) =>{
        this.setState({
            reviews: [...this.state.reviews, record]
        })
    }
    render(){
        console.log("all reviews", this.state.reviews)
        let revList = [];
        this.state.reviews.map(ele =>{
            revList.push(
                <div className="review-box" key={ele.id}>
                        <ReviewCurved key={ele.id} data={ele}/>
                    </div>
            )
            return ele
        })
        return(
            <React.Fragment>
                <div className="review-container">
                    {revList}
                </div>
                <AddReviewBTN addNewReview = {this.addNewReview}/>
            </React.Fragment>
        )
    }
}

export default AddReview;