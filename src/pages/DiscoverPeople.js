import React, { Component } from 'react';
import {FollowUnfollowUser, FollowUserCubeAlt, UserFlat, ConstructUserRecord} from '../components/Profile/UserView';
import DummyShots from '../components/Post/DummyShots';
import '../assets/css/profile.css';
import {NewsFeedUserMenu, NewsFeedSuggestions} from './NewsFeeds';
import '../assets/css/newsfeeds.css';
import '../assets/css/discoverPeople.css';
import {UserNavBar} from "../components/Navbar/Navbar";
import { DiscoverPeopleAPI } from '../utility/ApiSet';
import OwlLoader from '../components/OwlLoader';
import {getUserData, UpdateRecentFriends, UserRecentFriends} from '../utility/userData';

export class DiscoverPeople extends Component {
    state ={
        people: null,
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
    }

    componentDidMount(){
        DiscoverPeopleAPI(this.updateStateOnAPIcall.bind(this, 'people'));
        let eventListnerRef = this.handleScroll.bind(this);
        this.setState({eventListnerRef: eventListnerRef});
        window.addEventListener('scroll', eventListnerRef);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        
    }

    updateStateOnAPIcall = (key, data)=>{
        // console.log("updateStateOnAPIcall", key, data)
        if('count' in data && 'next' in data && 'previous' in data){
            // paginated response
            this.setState({
                [key]: data.results
            })
        }
        else{
            this.setState({
                [key]: data.data
            })
        }

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
            people:[...this.state.people, ...results],
            isFetching: false
        })
    }


    padDummyShot = (resultList, len, maxlen=5) =>{
        if (len < maxlen){
            for(let i =0; i< maxlen - len ; i++){
                resultList.push(<DummyShots  key={"DS"+ i }/>)
            }
        }
        return resultList
    }

    startFollowing =(record, res) =>{
        console.log(" startFollowing called", record)
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.username===record.username){
                    record.is_following = true;
                }
                return ele
            })
        })
        
    }

    stopFollowing =(record, res) =>{
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.username===record.username){
                    record.is_following = false;
                }
                return ele
            })
        })
    }

    render() {
        let resultList = [];
        if (!this.state.people){
            resultList = <div className="profile-user-grid"> <OwlLoader /></div>
        }
        else{
            // console.log(this.state.people)
            this.state.people.map(ele => 
                {
                    console.log(ele)
                    resultList.push(<FollowUserCubeAlt key={ele.username} data={ele} isFollowing={ele.is_following} 
                    startFollowing={this.startFollowing.bind(this, ele)} stopFollowing={this.stopFollowing.bind(this, ele)} />)
                return ele
            })
            resultList = this.padDummyShot(resultList, this.state.people.length, 5)

        }
        let current_user = getUserData().username
        
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"not-selected"} username={current_user}/>
                <div className="nf-container">
                    <NewsFeedUserMenu {...this.props}/>
                    <div className="nf-feeds">
                        <div className="discover-people-container">
                            <div className="headline">People you may know</div>
                            <div className="profile-user-grid">
                                {resultList}
                            </div>
                        </div>
                    </div>
                    
                    <NewsFeedSuggestions />
            </div>

            </React.Fragment>
            
        )
    }
}

export class DiscoverUserFlat extends Component{
    state={
        people: null
    }
    componentDidMount(){
        DiscoverPeopleAPI(this.updateStateOnAPIcall.bind(this, 'people'));
    }

    updateStateOnAPIcall = (key, data)=>{
        // paginated response
        this.setState({
            [key]: data.results
        })
        
    }
    startFollowing =(record, res) =>{
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.username===record.username){
                    ele.is_following = true;
                }
                return ele
            })
        })
        
    }

    stopFollowing =(record, res) =>{
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.username===record.username){
                    ele.is_following = false;
                }
                return ele
            })
        })
    }
    render(){
        let resultList = [];
        if (!this.state.people){
            return(<div className="profile-user-grid"> <OwlLoader /></div>)
        }
        else{
            this.state.people.map(ele => 
                {resultList.push(
                    <div className="discover-list" key={ele.username}>
                        <UserFlat data={ele}/>
                        {ele.is_following?
                            <span className="text-button" onClick={() => {
                                FollowUnfollowUser(ele, this.stopFollowing.bind(this, ele))
                                UpdateRecentFriends("unfollow", ConstructUserRecord(ele))
                                
                            }}> Remove</span>
                            :
                            <span className="text-button" onClick={() => {
                                FollowUnfollowUser(ele, this.startFollowing.bind(this, ele))
                                UpdateRecentFriends("follow", ConstructUserRecord(ele))
                            }}> Add</span>
                        }
                    </div>
                        
                    )
                return ele
            })
        }
        resultList = resultList.slice(0, this.props.counter)
        return(
            <React.Fragment>
                {resultList}
            </React.Fragment>
        )
    }
}

export class RecentFriendsPallette extends Component{
    state ={
        friends: null
    }

    componentDidMount(){
        UserRecentFriends(this.updateStateOnAPIcall, true);
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        this.setState({
            friends: data.results
        })
        
    }

    render(){
        let resultList = [];
        if (!this.state.friends){
            return(<div className="profile-user-grid"> <OwlLoader /></div>)
        }
        else{
            this.state.friends.map(ele => 
                {resultList.push(
                    <div className="discover-list" key={ele.username}>
                        <UserFlat data={ele} redirectPage={false}/>
                        
                        {/* <span className="text-button" onClick={() => {}}> Send</span> */}

                    </div>
                        
                    )
                return ele
            })
        }
        return(
            <div className="new-friends-container">
                {resultList}
            </div>
        )
    }

}

export default DiscoverPeople
