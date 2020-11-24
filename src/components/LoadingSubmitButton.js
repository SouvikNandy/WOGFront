import React from 'react';
import '../assets/css/login.css'

export default function LoadingSubmitButton({textVal}) {
    return(
        <button className="btn btn-loading" disabled={true}>
            {textVal}
        </button>
    )
}
