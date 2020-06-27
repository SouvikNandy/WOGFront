import React from 'react';
import '../assets/css/portfolio.css';


function Portfolio(props){
    let data = props.data
    let contained = data.shot.length
    return(
        <React.Fragment>
            <div className="pf-grid">
                {contained < 5?
                (contained < 3)?
                    <div className="pf-container-1">
                        <div className="pf-one"><img className="pf-img" src={data.shot[0]} alt="1"></img></div>
                    </div>
                    :
                    <div className="pf-container-3">
                        <div className="pf-one"><img className="pf-img" src={data.shot[0]} alt="1"></img></div>
                        <div className="pf-two"><img className="pf-img" src={data.shot[1]} alt="1"></img></div>
                        <div className="pf-three"><img className="pf-img" src={data.shot[2]} alt="1"></img></div>
                    </div>
                
                :
                <div className="pf-container-5">
                    <div className="pf-one"><img className="pf-img" src={data.shot[0]} alt="1"></img></div>
                    <div className="pf-two"><img className="pf-img" src={data.shot[1]} alt="1"></img></div>
                    <div className="pf-three"><img className="pf-img" src={data.shot[2]} alt="1"></img></div>
                    <div className="pf-four"><img className="pf-img" src={data.shot[3]} alt="1"></img></div>
                    <div className="pf-five"><img className="pf-img" src={data.shot[4]} alt="1"></img></div>
                </div>

                }
                <div className="pf-attribute">
                    <span className="pf-attr-span">
                        <div className="pf-name">{data.name}</div>
                        <div className="pf-shot-count">Shots {contained}</div>
                    </span>
                    
                </div>
            </div>
        </React.Fragment>
        );
}

export default Portfolio;