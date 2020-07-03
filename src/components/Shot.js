import React, { Component } from 'react';
import '../assets/css/landing.css';


import { Link } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";

// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";

export class ShotPalette extends Component {
    state = {
        Shots : [
            {id: 1, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
            {id: 3, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
            {id: 4, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
            {id: 5, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false},
            {id: 6, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
            {id: 7, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
            {id: 8, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
            {id: 9, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
            {id: 10, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false},
            {id: 11, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
            {id: 12, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
            {id: 13, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}, 
            {id: 14, shot: w1, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: pl2, is_liked: false}, 
            {id: 15, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, profile_pic: w1, is_liked: false}
        ],
    }

    componentDidMount(){
        // if shotData rreceived add in state else call api
        // console.log("received", this.props.shotData);
        if(this.props.shotData){
            this.setState({
                Shots: this.props.shotData
            })
        }
    }

    likeShot = (idx) => {
        // api call to update likes
        // also increase the count
        this.setState({
            Shots: this.state.Shots.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = true;
                    ele.likes++;
                }
                return ele
            })
        })
    }

    unLikeShot = (idx) => {
        // api call to update likes
        // also decrease the count
        this.setState({
            Shots: this.state.Shots.map(ele =>{
                if(ele.id === idx){
                    ele.is_liked = false;
                    ele.likes--;
                }
                return ele
            })
        })
    }

    render(){
        let shotList = [];
        this.state.Shots.map(ele => 
            {shotList.push(<Shot key={ele.id}  id={ele} data={ele} onlyShot={this.props.onlyShot} 
                currLocation={this.props.currLocation} likeShot={this.likeShot} unLikeShot={this.unLikeShot} />)
            return ele
        })

        return(
            <React.Fragment>
                {shotList}
            </React.Fragment>
        )
    }
}

export class Shot extends Component {
    render() {
        let data = this.props.data
        let shotClass = this.props.onlyShot ? "shot-preview-alt" : "shot-preview"
        return (
            <React.Fragment>
                <div className={shotClass}>
                    <Link className="sp-img"
                        key={data.key}
                        to={{
                            pathname: `/shot-view/${data.id}`,
                            // This is the trick! This link sets
                            // the `background` in location state.
                            state: { modal: true, currLocation: this.props.currLocation }
                        }}>

                        <img src={data.shot} alt="" />
                    </Link>
                    {!this.props.onlyShot ?
                        <span className="attribution-user">
                            <span className="user-preview">
                                <img src={data.profile_pic} alt="" />
                                <span className="display-name">{data.name} @{data.username}</span>
                            </span>

                            <span className="like-comment-share-preview">
                                {data.is_liked?
                                    <React.Fragment>
                                        <FaHeart className="icons icons-active" onClick={this.props.unLikeShot.bind(this, data.id)}/><span>{data.likes}</span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <FaHeart className="icons" onClick={this.props.likeShot.bind(this, data.id)}/><span>{data.likes}</span>
                                    </React.Fragment>                                
                                }
                                
                                <FaComment className="icons" /><span>{data.comments}</span>
                            </span>
                        </span>
                        : ''}
                </div>
                
            </React.Fragment>
        )

    }

}

export default ShotPalette;