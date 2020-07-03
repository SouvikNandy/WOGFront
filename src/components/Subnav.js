import React, {Component} from 'react';
import '../assets/css/subnav.css';

export default class Subnav extends Component {
    render(){
        let navList = [];
        let sliderClass = '';
        this.props.subNavList.map(item =>{
            if (item.isActive === true){
                sliderClass = "sub-slide slide-active"
            }
            else{
                sliderClass = "sub-slide"
            }

            if ('count' in item){
                navList.push(<li className={sliderClass} key={item.key}
                onClick={this.props.selectSubMenu.bind(this, item.key)}>
                {item.title} 
                <span className="sub-count">{this.props.getMenuCount(item.title)}</span>
                </li>
                )
            }
            else{
                navList.push(<li className={sliderClass} key={item.key}
                onClick={this.props.selectSubMenu.bind(this, item.key)}>
                {item.title} 
                <span className="sub-count" style={{color:'#fff'}}>.</span>
                </li>
                )
            }
            return true
        })

        return (
            <React.Fragment>
                <div className="profile-subnav">
                    <ul className="sub-nav">
                        {navList}
                    </ul>
                </div>
            </React.Fragment>
        )
    }
    
}
