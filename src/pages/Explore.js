import React, { Component } from 'react';
import "../assets/css/explore.css";
import '../assets/css/profile.css';
import SearchHead from '../components/Search/SearchHead';
import {Shot} from '../components/Post/Shot';
// Images for shot
import Footer from '../components/Footer';
import FeatureSlider from '../components/FeatureSlider';
import { RegularShotsAPI } from '../utility/ApiSet';
import Paginator from '../utility/Paginator';
import OwlLoader from '../components/OwlLoader';
import DummyShots from '../components/Post/DummyShots';
import { Link } from 'react-router-dom';


export class Explore extends Component {
    state ={
        userShot : null,
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
    }
    componentDidMount(){
        RegularShotsAPI(this.updateStateOnAPIcall);
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
        // paginated response
        this.setState({
            userShot: data.results,
            paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        })
    }
    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination, true, false)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            userShot:[...this.state.userShot, ...results],
            isFetching: false
        })
    }
    padDummyShot = (resultList, len, maxlen=5) =>{
        if (len < maxlen){
            for(let i =0; i< maxlen - len ; i++){
                resultList.push(<DummyShots key={ "DS"+ i } />)
            }
        }
        return resultList
    }
    render() {
        if(!this.state.userShot){return(<div className="explore-container"><OwlLoader/></div>)}
        let resultList = [];
        this.state.userShot.map((portfolio, index) => {
            // console.log("portfolio", portfolio)
            portfolio.attachments.map(ele=>{
                let data ={
                    id: ele.id, name: portfolio.user.name, username: portfolio.user.username, profile_pic: portfolio.user.profile_pic,
                    content: ele.content, 
                    interactions: portfolio.interactions, portfolio_id: portfolio.id
                }
                resultList.push(
                <Shot key={data.id} id={data.id} onlyShot={true} data={data} currLocation={this.props.location} 
                    likeShot={this.likeShot} unLikeShot={this.unLikeShot}
                />)
                return ele
            })
            return portfolio
        })
        resultList = this.padDummyShot(resultList, this.state.userShot.length, 5)
        return (
            <div className="explore-container">
                {/* hero section */}
                <section className="explore-hero">
                        <a 
                        href="https://www.pexels.com/photo/art-painting-on-walls-1227497/" className="link img-credits">
                        Shot by <span className="contributor-name">ShonEjai</span>
                        </a>
                        <div className="dark-overlay"></div>
                        <div className="e-head-content">
                            <SearchHead />
                            <div className="e-head-suggestions">
                                <div className="e-fixed-sug">
                                    <span className="tag-lable">Filters : </span>
                                    <span key={"ef1"} className="item-span">Shots</span>
                                    <span key={"ef2"} className="item-span">People</span>
                                    <span key={"ef3"} className="item-span">Hashtags</span>
                                </div>
                                <div className="e-floating-sug">
                                    <span className="tag-lable">Suggestions : </span>
                                    <span key={"efl1"} className="item-span">Photogarphers</span>
                                    <span key={"efl2"} className="item-span">Designers</span>
                                    <span key={"efl3"} className="item-span">Makeup-artists</span>
                                    <span key={"efl4"} className="item-span">Freelancers</span>
                                </div>
                            </div>
                            <div className="search-results">
                                {/* show search results here */}
                            
                            </div>
                        </div>
                        
                </section>
                {/* Featured Slider */}
                <section className="featured-slider">
                    <FeatureSlider />
                </section>
                <section className="explore-context">
                    <label>#Trending</label>
                </section>
                <section className="explore-shots">
                    <div className="profile-shots">
                        {resultList}
                    </div>
                </section>
                {!this.state.paginator || !this.state.paginator.next? <Footer />:""}
                


            </div>
        )
    }
}


export class ExplorePreview extends Component{
    state ={
        userShot : null,
    }
    componentDidMount(){
        RegularShotsAPI(this.updateStateOnAPIcall);
    }
    updateStateOnAPIcall = (data)=>{
        // paginated response
        // but we require only first page shots here
        this.setState({
            userShot: data.results,
        })
    }
    render(){
        if(!this.state.userShot){return(<div className="explore-container"><OwlLoader/></div>)}
        let resultList = [];
        this.state.userShot.map(portfolio => {
            portfolio.attachments.map(ele=>{
                resultList.push(<div key={ele.id} className="ex-1"><img src={ele.content} alt="" /></div>)
                return ele
            })
            return portfolio
        })

        resultList = resultList.slice(0, this.props.counter)

        return(
            <div className="explore-preview">
                {resultList}
                <div key={"e-more"} className="ex-1">
                    <Link className="link explore-more" to={'/explore/'}>Explore More</Link>
                </div>
            </div>
        )
    }
}

export default Explore
