import React, { Component } from 'react';
import '../assets/css/landing.css';
import DummyShots from '../components/DummyShots';


import { Link } from "react-router-dom";
import { FaHeart, FaPaperPlane } from "react-icons/fa";

// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";

export class ShotPalette extends Component {
    state = {
        Shots : [
            {id: 1, shot: w1, name: "John Doe", username: "johndoe11111", likes: 100, comments: 100, shares:0, profile_pic: pl2, is_liked: false}, 
            {id: 2, shot: pl2, name: "John Doe", username: "johndoe", likes: 100, comments: 100, shares:0, profile_pic: w1, is_liked: false}, 
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

    padDummyShot = (resultList, len, maxlen=5) =>{
        if (len < maxlen){
            for(let i =0; i< maxlen - len ; i++){
                resultList.push(<DummyShots key={ "DS"+ i } />)
            }
        }
        return resultList
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
        shotList = this.padDummyShot(shotList, this.state.Shots.length, 5)


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
                        key={data.id}
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
                            <Link className="link user-preview" to={{pathname: `/profile/${data.username}`}}>
                                <img src={data.profile_pic} alt="" />
                                <span className="display-name">{data.name} @{data.username}</span>
                            </Link>
                            <ShotFooterLikePreview data={data} unLikeShot={this.props.unLikeShot} likeShot={this.props.likeShot}/>
                            
                        </span>
                        : ''}
                </div>
                
            </React.Fragment>
        )

    }

}

export class ShotFooterLikePreview extends Component{
    render(){
        let data = this.props.data;
        return(
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
                
                <FaPaperPlane className="icons" /><span>{data.shares}</span>
            </span>
        )
    }
    
}

export default ShotPalette;