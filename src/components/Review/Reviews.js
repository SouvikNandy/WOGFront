import React, { Component, useState } from 'react';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import '../../assets/css/review.css';
import pl1 from "../../assets/images/wedding1.jpg"
import pl2 from "../../assets/images/people/2.jpg";
import { FaQuoteLeft, FaQuoteRight, FaFrown, FaMeh, FaLaugh, FaLaughWink, FaKissWinkHeart, FaUserCircle } from "react-icons/fa";
import { timeDifference } from '../../utility/Utility';


const getReactionIcon = (key) =>{
    switch(key){
        case "frown":
            return <FaFrown className="reaction-icon icons-active" />
        case "meh":
            return <FaMeh className="reaction-icon icons-active " />
        case "laugh":
            return <FaLaugh className="reaction-icon icons-active " />
        case "wink":
            return <FaLaughWink className="reaction-icon icons-active " />
        case "kiss":
            return <FaKissWinkHeart className="reaction-icon icons-active " />
        default:
            return <FaLaugh className="reaction-icon icons-active " />
    }
}


export function ReviewBlock(props) {
    let data = props.data
    return (
        <React.Fragment>
            <div className="rev-grid">
                <div className="rev-top">
                    <img src={data.cover_pic} alt="img1" />
                </div>
                <div className="rev-box">
                    <div className="rev-imgbox">
                        <img src={data.profile_pic} alt="img1" />
                    </div>
                    <p>
                        {data.review}
                    </p>
                    <div className="rev-rec">
                        {getReactionIcon(data.reaction)}
                    </div>
                    <h4>{data.name}<br /><span>{data.designation}</span></h4>
                </div>
            </div>

        </React.Fragment>
    )
}



export function ReviewCurved(props){
    let data = props.data
    const [deleteConfirmation, showDeleteConfirmation] = useState(false)
    return(
        <React.Fragment>
            <div className="rev-curved">
                <div className="rev-curved-imgbox">
                    {data.provider.profile_pic?
                    <img className="user-logo" src={data.provider.profile_pic} alt="" />
                    :
                    <FaUserCircle className="user-logo default-user-logo" />
                    }
                    
                </div>
                <div className="rev-curved-context">
                    <div className="rev-ctx-txt">
                        <FaQuoteLeft  className="quotes-icon quote-left"/>
                        <div>
                            <div className="rev-user-reaction">
                                <div className="rev-u">
                                    <h4 className="rev-u-name">{data.provider.username}
                                    <span className="rev-u-adj">{data.provider.profession}</span>
                                    </h4>
                                </div>
                                <div className="rev-reaction">
                                    {getReactionIcon(data.review.reaction)}
                                </div>
                            </div>
                            {data.review.text}
                        </div>
                        
                        <FaQuoteRight className="quotes-icon quote-right" />
                    </div>
                    <div className="rev-contect-edit-options">
                        {deleteConfirmation?
                            <React.Fragment>
                                <span>Continue delete?</span>
                                <span className="e-opt" onClick={()=> props.removeReview(data.id)}>Yes</span>
                                <span className="e-opt" onClick={()=> showDeleteConfirmation(!deleteConfirmation)}>No</span>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <span>{timeDifference(data.created_at)}</span>
                                {data.delete_perm? <span className="e-opt" onClick={()=> showDeleteConfirmation(!deleteConfirmation)}>Remove</span>: ""}
                            </React.Fragment>                        
                        }
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    )
}


export class ReviewSwiper extends Component{
    state = {
        reviews :[
            {id: 1, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 2, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 3, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 4, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
            {id: 5, name: "John Doe", username: "johndoe", designation: "Creative Director", profile_pic: pl2, review:"where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", cover_pic: pl1},
        ]
    }

    componentDidMount() {
        new Swiper('.swiper-container', {
            slidesPerView: "auto",
            spaceBetween: 30,
            centeredSlides: true,
            grabCursor: true,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    render(){
        let reviewList = [];

        this.state.reviews.map(ele=>{
            reviewList.push(<div className="swiper-slide" key={ele.id}><ReviewBlock key={ele.id}  data={ele} /></div>)
            return ele
        })

        
        return(
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {reviewList}
                </div>
                <div className="swiper-pagination"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </div>
        )
    }
}

export default {ReviewBlock, ReviewCurved, ReviewSwiper}
