import React from 'react';
import {DiProlog} from 'react-icons/di';
import '../assets/css/noContent.css';

export default function NoContent(props) {
    return (
        <div className="no-content-div">
            <DiProlog  className="no-content-icon" />
            <div className="no-content-text">
                {props.message}
            </div>
        </div>
    )
}
