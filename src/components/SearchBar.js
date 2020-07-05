import React, { Component } from 'react';
import "../assets/css/config.css";

import { GrSearchAdvanced } from "react-icons/gr";


export default class SearchBar extends Component {
    timer = 0;

    handleChange = (evt) => {
        // send 500ms after user stops typing
        let val = evt.target.value;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
        if (val) {
            this.props.searchOnChange(val)
          }
        }, 500);
      }

    render(){
        const placeHolder = this.props.searchPlaceHolder? this.props.searchPlaceHolder : "Search Shots/Events/People ...";
        let outerDivClass = this.props.searchBarRequired ===false ? "search-div invisible": "search-div"
        return (
            <div className={outerDivClass}>
                {this.props.searchOnChange?
                <input type="text" placeholder={placeHolder} onChange={this.handleChange}/>
                :
                <input type="text" placeholder={placeHolder} />
                }
                
                <button className="btn-anc search-btn"><GrSearchAdvanced className="srch-icon" /></button>
            </div>
        )

    }
    
}
