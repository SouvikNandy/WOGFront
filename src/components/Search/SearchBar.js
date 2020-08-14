import React, { Component } from 'react';
import "../../assets/css/config.css";
import "../../assets/css/searchHead.css";

import {AiFillCloseCircle} from 'react-icons/ai';
// import { GrSearchAdvanced } from "react-icons/gr";


export default class SearchBar extends Component {
    timer = 0;

    componentDidMount(){
        if(this.props.focusSearchBar){
            document.getElementById("search-box").focus();
        }
    }

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
        const placeHolder = this.props.searchPlaceHolder? this.props.searchPlaceHolder : "Search Shots/People/Hashtags ...";
        let outerDivClass = this.props.searchBarRequired ===false ? "search-div invisible": "search-div"
        return (
            <div className={outerDivClass}>
                <div className="search-inp-box">
                    {this.props.defaultSearch?
                    <input type="text" placeholder={placeHolder} id="search-box-default" 
                    onSelect={this.props.searchBarSelected} onChange={this.handleChange}/>
                    :
                    <input type="text" placeholder={placeHolder} onChange={this.handleChange} id="search-box"/>
                    
        
                    }
                    {this.props.searchDropDown?
                        <div className="search-dropdown">
                            <div className="s-filters">
                                <SearchFilters closeDropdown={this.props.searchBarSelected} filterBy={this.props.filterBy}/>
                            </div>
                            <div className="dropdown-container">
                                {this.props.dropdownContent}
                            </div>

                        </div>
                        :
                        ""
                    }
                </div>
                
                
                
                {/* <button className="btn-anc search-btn"><GrSearchAdvanced className="srch-icon" /></button> */}
            </div>
        )

    }
    
}

function SearchFilters(props){
    return(
        <div className="filter-search">
            <div className="filter-options">
                
                <span key={"sf2"} className="item-span" onClick={() => props.filterBy('user')}>People</span>
                <span key={"sf3"} className="item-span" onClick={() => props.filterBy('hashtag')}>Hashtags</span>
                <span key={"sf1"} className="item-span" onClick={() => props.filterBy('shots')}>Shots From Location</span>
            </div>
            <div className="close-div" onClick={props.closeDropdown}>
                <AiFillCloseCircle className="close-btn close-menu"  />
            </div>

        </div>
    )
}