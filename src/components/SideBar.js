import React, { Component } from 'react';
import "../assets/css/sidebar.css";
import SearchBar from "./Search/SearchBar";
import { AiOutlineCloseCircle } from "react-icons/ai";


export class SideBar extends Component{
    render(){
        return(
            <div className="side-bar">
                {this.props.sideBarHead?
                <SideBarHead displaySideView={this.props.displaySideView} searchPlaceHolder={this.props.searchPlaceHolder} 
                searchBarRequired={this.props.searchBarRequired}/>
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
        return(
            <section className="side-bar-head">
                <AiOutlineCloseCircle className="close-btn" onClick={this.props.displaySideView.bind(this, {sureVal: false})}/>
                
                <SearchBar className="srch-bar" searchPlaceHolder={this.props.searchPlaceHolder} 
                focusSearchBar ={this.props.focusSearchBar}
                searchOnChange={this.props.searchOnChange} searchBarRequired={this.props.searchBarRequired}/>
            </section>
        )
    }
}

export default SideBar;