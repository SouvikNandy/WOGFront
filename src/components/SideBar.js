import React, { Component } from 'react';
import "../assets/css/sidebar.css";
import SearchBar from "./Search/SearchBar";
// import { AiOutlineCloseCircle } from "react-icons/ai";
import {FiArrowRightCircle} from 'react-icons/fi'


export class SideBar extends Component{
    render(){
        return(
            <div className="side-bar">
                {this.props.sideBarHead?
                <SideBarHead displaySideView={this.props.displaySideView} searchPlaceHolder={this.props.searchPlaceHolder} 
                searchBarRequired={this.props.searchBarRequired} altHeadText={this.props.altHeadText} />
                :
                ""
                }
                
                <section className="side-bar-content">
                    {this.props.content}
                </section>
            </div>
        )
    }
}

export class SideBarHead extends Component{
    render(){
        console.log("")
        return(
            <section className="side-bar-head">
                <div className="back-div">
                    <FiArrowRightCircle className="close-btn" onClick={this.props.displaySideView.bind(this, {sureVal: false})}/>
                </div>
                {this.props.searchBarRequired!==false? 
                <SearchBar className="srch-bar" searchPlaceHolder={this.props.searchPlaceHolder} 
                focusSearchBar ={this.props.focusSearchBar}
                searchOnChange={this.props.searchOnChange} searchBarRequired={this.props.searchBarRequired}/>
                :
                <div className="alternate-text">
                    {this.props.altHeadText?
                        <React.Fragment>{this.props.altHeadText}</React.Fragment>
                    :
                    ""
                    }
                    
                </div>
                }
                
            </section>
        )
    }
}

export default SideBar;