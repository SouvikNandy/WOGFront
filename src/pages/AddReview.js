import React, { Component } from 'react';
import {ReviewCurved} from "../components/Reviews";
import "../assets/css/addpost.css";
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
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
                {this.state.isModalOpen ? <AddReviewForm showModal={this.showModal} />
                :
                <button className="camera-cover" onClick={this.showModal}>
                    <FaPencilAlt className="camera-icon" />
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
                            <label>Name</label>
                            <input type="text" id="rev-user-name" name="name" onChange={this.onChange} />
                            <label>Description</label>
                            <textarea type="text" id="user-rev" name="revire" onChange={this.onChange} required/>

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
    render(){
        let revList = [];
        this.state.reviews.map(ele =>{
            revList.push(
                <div className="review-box" key={ele.id}>
                        <ReviewCurved data={ele}/>
                    </div>
            )
            return ele
        })
        return(
            <React.Fragment>
                <div className="review-container">
                    {revList}
                </div>
                <AddReviewBTN />
            </React.Fragment>
        )
    }
}

export default AddReview;