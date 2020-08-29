import React from 'react'
import OwlLoader from '../OwlLoader'

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

export default DummyShots
