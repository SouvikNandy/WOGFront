import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';
import { FaBars } from "react-icons/fa";

export class Navbar extends Component {

    onSelect = (label) => {

        this.setState({
            navLinks: this.props.navLinks.map(obj => {
                if (obj.label === label) {
                    obj.active = true
                }
                else {
                    obj.active = false
                }
                return obj;
            })
        });

    }

    showResponsiveMenu = () => {
        var target = document.getElementById('menu_right');
        if (target.className === "menu-right") {
            target.className += "-res";
        }
        else {
            target.className = "menu-right"
        }

    }


    render() {

        let linksMarkup = this.props.navLinks.map((obj) => {
            let clsName = obj.active ? "menu-link menu-link--active" : "menu-link"
            return (
                <li className="menu-list-item" key={obj.label}>
                    <a className={clsName} href={obj.link} onClick={this.onSelect.bind(this, obj.label)}>{obj.label}</a></li>
            );
        })

        return (
            <React.Fragment>
                <div className="nav-container center">
                    <nav className="menu">
                        <div className="menu-logo" />
                        <div className="menu-right" id="menu_right">
                            <ul className="menu-list">
                                {linksMarkup}
                            </ul>
                        </div>
                        <button className="btn-anc" id="iconbar" onClick={this.showResponsiveMenu}><FaBars /></button>
                    </nav>
                </div>

            </React.Fragment>

        )
    }
}

export default Navbar
