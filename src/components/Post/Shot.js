import React, { Component } from 'react';
import '../../assets/css/landing.css';
import DummyShots from './DummyShots';


import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaRegEye } from "react-icons/fa";
import {RegularShotsAPI} from '../../utility/ApiSet';
import Paginator from '../../utility/Paginator';
import OwlLoader from '../OwlLoader';

export class ShotPalette extends Component {
    state = {
        Shots : null
    }

    componentDidMount(){
        // if shotData rreceived add in state else call api
        // console.log("received", this.props.shotData);
        if(this.props.shotData){
            this.setState({
                Shots: this.props.shotData
            })
        }
        else{
            // api call - get random shots
            RegularShotsAPI(this.updateStateOnAPIcall)

        }
    }
    updateStateOnAPIcall = (data)=>{
        if('count' in data && 'next' in data && 'previous' in data){
            // paginated response
            this.setState({
                Shots: data.results,
                paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
            })
        }
        else{
            this.setState({
                Shots: data.data
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
        if (!this.state.Shots){
            return(<React.Fragment><OwlLoader /></React.Fragment>)
        }
        let shotList = [];
        console.log("shotpal", this.props)
        this.state.Shots.map(portfolio => {
            portfolio.attachments.map(ele=>{
                let data ={
                    id: ele.id, name: portfolio.user.name, username: portfolio.user.username, profile_pic: portfolio.user.profile_pic,
                    content: ele.content, 
                    interactions: portfolio.interactions, portfolio_id: portfolio.id
                }
                shotList.push(
                <Shot key={data.id} id={data.id} onlyShot={false} data={data} currLocation={this.props.currLocation} 
                likeShot={this.likeShot} unLikeShot={this.unLikeShot}

                />)
                return ele
            })
            return portfolio
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
        console.log("data", data)
        let shotClass = this.props.onlyShot ? "shot-preview-alt" : "shot-preview"
        let redirect_key = data.username +'-'+ data.portfolio_id +'-'+ data.id
        console.log(redirect_key);
        return (
            <React.Fragment>
                <div className={shotClass}>
                    <Link className="sp-img"
                        key={data.id}
                        to={{
                            pathname: `/shot-view/${redirect_key}`,
                            // This is the trick! This link sets
                            // the `background` in location state.
                            state: { modal: true, currLocation: this.props.currLocation }
                        }}>

                        <img src={data.content} alt="" />
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
                        <FaHeart className="icons icons-active" onClick={this.props.unLikeShot.bind(this, data.id)}/><span>{data.interactions.likes}</span>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <FaRegHeart className="icons" onClick={this.props.likeShot.bind(this, data.id)}/><span>{data.interactions.likes}</span>
                    </React.Fragment>                                
                }
                
                <FaRegEye className="icons" /><span>{data.interactions.views}</span>
            </span>
        )
    }
    
}

export default ShotPalette;