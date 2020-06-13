import React from 'react';
import '../assets/css/portfolio.css';
import forest from "../assets/images/wedding1.jpg";


function Portfolio(props){
    return(
        <React.Fragment>
            <div className="pf-grid">
                {props.contained < 5?
                (props.contained < 3)?
                    <div className="pf-container-1">
                        <div className="pf-one"><img className="pf-img" src={forest} alt="1"></img></div>
                    </div>
                    :
                    <div className="pf-container-3">
                        <div className="pf-one"><img className="pf-img" src={forest} alt="1"></img></div>
                        <div className="pf-two"><img className="pf-img" src={forest} alt="1"></img></div>
                        <div className="pf-three"><img className="pf-img" src={forest} alt="1"></img></div>
                    </div>
                
                :
                <div className="pf-container-5">
                    <div className="pf-one"><img className="pf-img" src={forest} alt="1"></img></div>
                    <div className="pf-two"><img className="pf-img" src={forest} alt="1"></img></div>
                    <div className="pf-three"><img className="pf-img" src={forest} alt="1"></img></div>
                    <div className="pf-four"><img className="pf-img" src={forest} alt="1"></img></div>
                    <div className="pf-five"><img className="pf-img" src={forest} alt="1"></img></div>
                </div>

                }
                <div className="pf-attribute">
                    <span className="pf-attr-span">
                        <div className="pf-name">Name</div>
                        <div className="pf-shot-count">Shots {props.contained}</div>
                    </span>
                    
                </div>
            </div>
        </React.Fragment>
        );
}

export default Portfolio;