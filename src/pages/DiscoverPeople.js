import React, { Component } from 'react';
import {FollowUserCubeAlt} from '../components/Profile/UserView';
import DummyShots from '../components/Post/DummyShots';
import '../assets/css/profile.css';
import {NewsFeedUserMenu, NewsFeedSuggestions} from './NewsFeeds';
import '../assets/css/newsfeeds.css';
import '../assets/css/discoverPeople.css';
import {UserNavBar} from "../components/Navbar/Navbar";
import { DiscoverPeopleAPI } from '../utility/ApiSet';
import OwlLoader from '../components/OwlLoader';
import {getUserData} from '../utility/userData';

export class DiscoverPeople extends Component {
    state ={
        people: null
    }

    componentDidMount(){
        DiscoverPeopleAPI(this.updateStateOnAPIcall.bind(this, 'people'))
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


    padDummyShot = (resultList, len, maxlen=5) =>{
        if (len < maxlen){
            for(let i =0; i< maxlen - len ; i++){
                resultList.push(<DummyShots  key={"DS"+ i }/>)
            }
        }
        return resultList
    }

    startFollowing =(record) =>{
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.id===record.id){
                    record.is_following = true;
                }
                return ele
            })
        })
        
    }

    stopFollowing =(record) =>{
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.id===record.id){
                    record.is_following = false;
                }
                return ele
            })
        })
    }

    render() {
        console.log("dicover people", this.props)
        let resultList = [];
        if (!this.state.people){
            resultList = <div className="profile-user-grid"> <OwlLoader /></div>
        }
        else{
            console.log(this.state.people)
            this.state.people.map(ele => 
                {resultList.push(<FollowUserCubeAlt key={ele.username} data={ele} isFollowing={ele.is_following} 
                    startFollowing={this.startFollowing} stopFollowing={this.stopFollowing} />)
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

export default DiscoverPeople
