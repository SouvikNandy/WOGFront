import React, { Component } from 'react';
import {FollowUserCubeAlt} from '../components/UserView';
import DummyShots from '../components/DummyShots';
import '../assets/css/profile.css';
import {NewsFeedUserMenu, NewsFeedSuggestions} from './NewsFeeds';
import '../assets/css/newsfeeds.css';
import '../assets/css/discoverPeople.css';
import {UserNavBar} from "../components/Navbar";

// Images for shot
import w1 from "../assets/images/wedding1.jpg";
import pl2 from "../assets/images/people/2.jpg";

export class DiscoverPeople extends Component {
    state ={
        people:[
            {"id": 1, "name":"John Doe", "username": "jhndoe", "profile_pic": w1, "designation": "photographer", "isFollowing": false},
            {"id": 2, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer", "isFollowing": false},
            {"id": 3, "name":"Jenny Doe", "username": "jennydoe", "profile_pic": pl2, "designation": "photographer", "isFollowing": false}
        ],
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
                    record.isFollowing = true;
                }
                return ele
            })
        })
        
    }

    stopFollowing =(record) =>{

        console.log("stop following user called");
        this.setState({
            people: this.state.people.map(ele =>{
                if(ele.id===record.id){
                    record.isFollowing = false;
                }
                return ele
            })
        })
    }

    render() {
        let resultList = [];
        this.state.people.map(ele => 
            {resultList.push(<FollowUserCubeAlt key={ele.id} data={ele} isFollowing={ele.isFollowing} 
                startFollowing={this.startFollowing} stopFollowing={this.stopFollowing} />)
            return ele
        })
        resultList = this.padDummyShot(resultList, this.state.people.length, 5)
        return (
            <React.Fragment>
                <UserNavBar selectedMenu={"not-selected"} username={this.props.username}/>
                <div className="nf-container">
                    <NewsFeedUserMenu {...this.props}/>
                    <div className="nf-feeds">
                        <div className="discover-people-container">
                            <div className="profile-portfolio-grid">
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
