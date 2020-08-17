import React from 'react';
import '../assets/css/page404.css';
import {DiProlog} from 'react-icons/di';
import Goback from '../components/GoBack'

export default function Page404() {
    return (
        <div className="lost-page">
            <div className="lost-content">
                <div className="top-content">
                    <span>4</span>
                    <DiProlog className="owl bounce-owl"/>
                    <span>4</span>
                </div>
                <div className="bottom-content">
                    <span className="fun-text"> ... Are you lost ... ?? ...</span>
                    <Goback btnText={"Go back"} /> 
                </div>
            </div>
            
        </div>
    )
}
