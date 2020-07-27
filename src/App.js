import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ShotModalView from './components/ShotModalView';
// import Example from './components/FloatingNotifications';
import Profile from './pages/Profile';
import CommunityReview from './pages/CommunityReview';
import {NotificationContainer} from 'react-notifications';
import Explore from './pages/Explore';
import {silentRefresh} from './utility/Utility';
// import {PrivateRoute} from './utility/PrivateRoute';
import UserLoggedInView from "./pages/UserLoggedInView";


export default class App extends Component {
  componentDidMount(){
    silentRefresh();
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
      <Switch location={isModal ? previousLocation : location}>
        {/* <Switch location={previousLocation || location}> */}
        <Route exact path="/" component={Landing} />
        <Route exact path="/home/" component={Landing} />
        <Route exact path="/signup/" component={Login} />
        <Route exact path="/signin/" render={props => (<Login signInReq={true} />)} />
        <Route exact path="/profile/:username" component={Profile} />
        <Route exact path="/shot-view/:id" component={ShotModalView} />
        <Route exact path="/reviews/" component={CommunityReview} />
        <Route exact path="/explore/" component={Explore} />
        <Route exact path="/user-view/" component={UserLoggedInView} />
        {/* <PrivateRoute path="/user-view/" component={UserLoggedInView} /> */}
        <Route> NOT FOUND</Route>
      </Switch>
      {isModal
        ? <Route exact path="/shot-view/:id" component={ShotModalView} />
        : null
      }

    </React.Fragment>
  )

}