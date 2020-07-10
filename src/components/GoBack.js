import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../assets/css/config.css';
import { FaAngleLeft } from "react-icons/fa";


export class GoBack extends Component{
    gotoPrev = (e) => {
        e.stopPropagation();
        this.props.history.goBack()
    }
    render(){
        let iconClass = this.props.activeIcon? 'icons-active' : 'icons'
        return(
            <React.Fragment>
                <button className="btn-anc" onClick={this.props.clickMethod? this.props.clickMethod: this.gotoPrev}>
                    <FaAngleLeft className={iconClass} />
                </button>
            </React.Fragment>
        )
    }
}

export default withRouter(GoBack);