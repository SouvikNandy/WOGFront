import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';
import { FaAlignRight } from "react-icons/fa";

export class Navbar extends Component {
    state ={
        ResponsiveMenu : false
    }

    displayResponsiveView = () =>{
        this.setState({
            ResponsiveMenu: !this.state.ResponsiveMenu
        })
    }


    render() {

        let linksMarkup = this.props.navLinks.map(obj => {
            return (
                <li className="menu-list-item" key={obj.key}>
                    {obj.isActive?
                    <Link className="menu-link menu-link--active" to={obj.link}>{obj.label}</Link>
                    :
                    <Link className="menu-link" to={obj.link} 
                    onClick={this.props.selectMenu.bind(this, obj.key)}>
                    {obj.label}
                    </Link>
                    }
                </li>
                )
        })

        let menuClass = this.state.ResponsiveMenu? "menu-right-res": "menu-right"

        return (
            <React.Fragment>
                <div className="nav-container center">
                    <nav className="menu">
                        <div className="menu-logo" />
                        <div className={menuClass} id="menu_right">
                            <ul className="menu-list">
                                {linksMarkup}
                            </ul>
                        </div>
                        <button className="btn-anc" id="iconbar" onClick={this.displayResponsiveView}><FaAlignRight /></button>
                    </nav>
                </div>

            </React.Fragment>

        )
    }
}

export default Navbar
