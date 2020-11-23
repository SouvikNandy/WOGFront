import React from 'react';
import OwlLoader from '../OwlLoader';
import { AiOutlineDownCircle } from 'react-icons/ai';


export function DummyShots(props) {

    return (
        <div className="dummy-shot-container">
            {props.loaderShot?
            <OwlLoader />
            :
            ""
            }
        </div>
    )
    
}

export function LoadMoreShot(props){
    return (
        <div className="dummy-shot-container" onClick={props.onClick}>
            <div className="load-more-shots">
                Hi, Load more
                <AiOutlineDownCircle className="load-more-icon"/>
            </div>
        </div>
    )
}

export default DummyShots
