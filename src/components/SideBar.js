import React, { Component } from 'react';
import "../assets/css/sidebar.css";
import SearchBar from "../components/SearchBar";
import { AiOutlineCloseCircle } from "react-icons/ai";


export class SideBar extends Component{
    render(){
        return(
            <div className="side-bar">
                <section className="side-bar-head">
                    <AiOutlineCloseCircle className="close-btn" onClick={this.props.displaySideView.bind(this, {sureVal: false})}/>
                    <SearchBar className="srch-bar"/>
                </section>
                <section className="side-bar-content">
                    {this.props.content}
                </section>
            </div>
        )
    }
}

export default SideBar;