import React, { Component } from 'react';

import {ReviewCurved} from "../components/Reviews"
import pl1 from "../assets/images/wedding1.jpg"
import pl2 from "../assets/images/people/2.jpg";

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
                        <ReviewCurved data={this.state.reviews[0]}/>
                    </div>
            )
            return ele
        })
        return(
            <React.Fragment>
                <div className="review-container">
                    {revList}
                </div>
            </React.Fragment>
        )
    }
}

export default AddReview;