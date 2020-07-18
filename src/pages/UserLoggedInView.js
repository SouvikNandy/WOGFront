import React, { Component } from 'react';
import {UserNavBar} from "../components/Navbar";
import NewsFeeds from './NewsFeeds';

export class UserLoggedInView extends Component {
    render() {
        return (
            <React.Fragment>
                <UserNavBar />
                <NewsFeeds />
            </React.Fragment>
        )
    }
}

export default UserLoggedInView
