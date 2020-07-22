import React, { Component } from 'react';
import {NewsFeedUserMenu, NewsFeedSuggestions} from '../pages/NewsFeeds';
import '../assets/css/notifications.css';

export class Notifications extends Component {
    render() {
        return (
            <div>
                <NewsFeedUserMenu />
                {/* <div className="nf-feeds notification-container">
                </div> */}
                <NewsFeedSuggestions />
            </div>
        )
    }
}

export default Notifications
