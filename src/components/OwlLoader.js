import React, { Component } from 'react';
import {DiProlog} from 'react-icons/di';
import '../assets/css/page404.css';
import '../assets/css/owlloader.css';

export class OwlLoader extends Component {
    render() {
        return (
            <div className="loader-container">
                <div className="owl-conatiner">
                    <DiProlog className="owl bounce-owl"/>
                </div>
                
                <div class="loading-dots">
                    <div class="loading-dots--dot"></div>
                    <div class="loading-dots--dot"></div>
                    <div class="loading-dots--dot"></div>
                </div>
            </div>
        )
    }
}

export default OwlLoader
