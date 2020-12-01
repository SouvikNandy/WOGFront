import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import LoginModal, {Login}  from './pages/Login';
import ShotModalView from './components/Post/ShotModalView';
import Profile from './pages/Profile';
import CommunityReview from './pages/CommunityReview';
import {NotificationContainer} from 'react-notifications';
import Explore from './pages/Explore';
import {isAuthenticated, silentRefresh} from './utility/Utility';
import {PrivateRoute} from './utility/PrivateRoute';
import NewsFeeds from './pages/NewsFeeds';
import Notifications from './pages/Notifications'
import DiscoverPeople from './pages/DiscoverPeople';
import Page404 from './pages/Page404';
import CommmunityGuidelines from './pages/CommunityGuidelines';
import LogOutPromptModal from './components/LogOutPromptModal';
import EditPost from './components/Post/EditPost';
import getUserData, { setNotificationHandler } from './utility/userData';
import InitializeChatHistory from './components/ChatModule/chatUtils';
import AllFriends from './pages/AllFriends';
import ForgotPass from './pages/ForgotPass';
import Store from './GlobalStorage/Store';
import { SharePost } from './components/Post/SharePost';

export default class App extends Component {
    componentDidMount(){
        // check if tx in localstorage
        
        if(isAuthenticated()){
            // set notification handler on each refresh
            InitializeChatHistory();
            setNotificationHandler(getUserData().username);
            silentRefresh();
        }
    }

    render() {
    
        return (
            <Router>
                <div className="App">
                    <ShotModalUrl />
                    <NotificationContainer/>
                </div>
            </Router>
      

        );
    }
}


function ShotModalUrl() {

    let location = useLocation();
    let previousLocation = location.state && location.state.currLocation;
    const isModal = (
        location.state &&
        location.state.modal &&
        previousLocation !== location
    );
    return (
        <React.Fragment>
        <Store>
        <Switch location={isModal ? previousLocation : location}>
            {/* <Switch location={previousLocation || location}> */}
            <Route exact path="/" component={Landing} />
            <Route exact path="/home/" component={Landing} />
            <Route exact path="/signup/" component={Login} />
            <Route exact path="/signin/" render={props => (<Login signInReq={true} />)} />
            <Route exact path="/forgot-pass/" component={ForgotPass} />
            <Route exact path="/m-auth/" component={LoginModal} />
            <Route exact path="/profile/:username" component={Profile} />
            <Route exact path="/shot-view/:id" component={ShotModalView} />
            <Route exact path="/reviews/" render={props => (<CommunityReview username={"weddingograffiti"} />)} />
            <Route exact path="/explore/" component={Explore} />
            {/* <Route exact path="/join/" component={Join} /> */}
            {/* <Route exact path="/chat/" component={Chat} /> */}
            <PrivateRoute exact path="/user-feeds/:username" component={NewsFeeds} />
            <PrivateRoute exact path="/user-profile/:username" component={Profile} AuthenticatedOnly={true} />
            <PrivateRoute exact path="/user-notifications/:username" component={Notifications} />
            <PrivateRoute exact path="/discover-people/:username" component={DiscoverPeople} />
            <PrivateRoute exact path="/all-friends/" component={AllFriends} />
            <PrivateRoute exact path="/log-out/" component={LogOutPromptModal} />
            <PrivateRoute exact path="/edit-shot/:id" component={EditPost} />
            <PrivateRoute exact path="/share-shot/:id" component={SharePost} />
            <PrivateRoute exact path="/edit-shared/:id" component={SharePost} />
            <Route exact path="/guidelines" component={CommmunityGuidelines} />
            
            <Route> <Page404 /> </Route>
            
        </Switch>
        {isModal
            ? <Route exact path="/shot-view/:id" component={ShotModalView} />
            : null
        }
        {isModal
            ? <PrivateRoute exact path="/edit-shot/:id" component={EditPost} />
            : null
        }
        {isModal
            ? <PrivateRoute exact path="/share-shot/:id" component={SharePost} />
            : null
        }
        {isModal
            ? <PrivateRoute exact path="/edit-shared/:id" component={SharePost} />
            : null
        }
        {isModal
            ? <Route exact path="/m-auth/" component={LoginModal} />
            : null
        }
        </Store>
        </React.Fragment>
    )

}