import React, { Component } from 'react';
import '../../assets/css/portfolio.css';
import { ShotFooterLikePreview } from '../Post/Shot';
import { Link } from 'react-router-dom';


export class Portfolio extends Component{
    render(){
        let data = this.props.data;
        let contained = data.attachments.length;
        let redirect_key = data.user.username +'-'+ data.id +'-'+ data.attachments[0].id
    return(
        <React.Fragment>
            <div className="pf-grid">
                {contained < 5?
                    (contained < 3)?
                        <Link className="pf-container-1" key={data.id} to={{
                            pathname: `/shot-view/${redirect_key}`,
                            // This is the trick! This link sets
                            // the `background` in location state.
                            state: { modal: true, currLocation: this.props.currLocation }
                        }}>
                            <div className="pf-one"><img className="pf-img" src={data.attachments[0].content} alt=""></img></div>
                        </Link>
                        :
                        <Link className="pf-container-3" key={data.id} to={{
                            pathname: `/shot-view/${redirect_key}`,
                            // This is the trick! This link sets
                            // the `background` in location state.
                            state: { modal: true, currLocation: this.props.currLocation }
                        }}>
                            <div className="pf-one"><img className="pf-img" src={data.attachments[0].content} alt=""></img></div>
                            <div className="pf-two"><img className="pf-img" src={data.attachments[1].content} alt=""></img></div>
                            <div className="pf-three"><img className="pf-img" src={data.attachments[2].content} alt=""></img></div>
                            {contained>3?
                                <div className="count-overlay">
                                    <div className="more-count">+{contained - 3}</div>
                                </div>
                                :
                                ""
                                }
                        </Link>
                
                :
                <Link className="pf-container-5" key={data.id} to={{
                    pathname: `/shot-view/${redirect_key}`,
                    // This is the trick! This link sets
                    // the `background` in location state.
                    state: { modal: true, currLocation: this.props.currLocation }
                }}>
                    <div className="pf-one"><img className="pf-img" src={data.attachments[0].content} alt=""></img></div>
                    <div className="pf-two"><img className="pf-img" src={data.attachments[1].content} alt=""></img></div>
                    <div className="pf-three"><img className="pf-img" src={data.attachments[2].content} alt=""></img></div>
                    <div className="pf-four"><img className="pf-img" src={data.attachments[3].content} alt=""></img></div>
                    <div className="pf-five">
                        {contained>5?
                            <div className="count-overlay">
                                <div className="more-count">+{contained - 5}</div>
                            </div>
                            :
                            ""
                        }
                        <img className="pf-img" src={data.attachments[4].content} alt=""></img>
                    </div>
                </Link>

                }
                {this.props.onlyShots?
                ""
                :
                <div className="pf-attribute">
                    <span className="pf-attr-span">
                        <div className="pf-name">{data.portfolio_name}</div>
                    </span>
                    <ShotFooterLikePreview data={data} unLikeShot={this.props.unLikePortfolio} likeShot={this.props.likePortfolio} />
                    
                </div>
                }
                
            </div>
        </React.Fragment>
        );
    }

    }
    

export default Portfolio;