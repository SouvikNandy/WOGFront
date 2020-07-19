import React, { Component } from 'react';
import '../assets/css/portfolio.css';
import ShotModalView from './ShotModalView';
import { ShotFooterLikePreview } from '../components/Shot';


export class Portfolio extends Component{
    state = {
        showModal: false,
        sliderRequired: false,
    }

    openModalView = (slider=false) =>{
        if(slider){
            this.setState({
                sliderRequired: slider,
                showModal: !this.state.showModal})
        }
        else{
            this.setState({showModal: !this.state.showModal})
        }

    }

    iterifyArr = (arr) => {
        let cur = 0;
        arr.next = (function () { return (++cur >= this.length) ? false : this[cur]; });
        arr.prev = (function () { return (--cur < 0) ? false : this[cur]; });
        return arr;
    };

    getPrev = () =>{
        let result = this.props.data.shot.prev();
        return result
    }

    getNext = () =>{
        let result = this.props.data.shot.next();
        return result
    }

    render(){
        let data = this.props.data;
        let contained = data.shot.length;
        if (contained > 1){
            this.iterifyArr(this.props.data.shot)
        }
    return(
        <React.Fragment>
            <div className="pf-grid">
                {contained < 5?
                (contained < 3)?
                    <div className="pf-container-1" onClick={contained >1 ? this.openModalView.bind(this, true) : this.openModalView.bind(this,false)}>
                        <div className="pf-one"><img className="pf-img" src={data.shot[0]} alt="1"></img></div>
                    </div>
                    :
                    <div className="pf-container-3" onClick={this.openModalView.bind(this, true)}>
                        <div className="pf-one"><img className="pf-img" src={data.shot[0]} alt="1"></img></div>
                        <div className="pf-two"><img className="pf-img" src={data.shot[1]} alt="1"></img></div>
                        <div className="pf-three"><img className="pf-img" src={data.shot[2]} alt="1"></img></div>
                    </div>
                
                :
                <div className="pf-container-5" onClick={this.openModalView.bind(this, true)}>
                    <div className="pf-one"><img className="pf-img" src={data.shot[0]} alt="1"></img></div>
                    <div className="pf-two"><img className="pf-img" src={data.shot[1]} alt="1"></img></div>
                    <div className="pf-three"><img className="pf-img" src={data.shot[2]} alt="1"></img></div>
                    <div className="pf-four"><img className="pf-img" src={data.shot[3]} alt="1"></img></div>
                    <div className="pf-five"><img className="pf-img" src={data.shot[4]} alt="1"></img></div>
                </div>

                }
                {this.props.onlyShots?
                ""
                :
                <div className="pf-attribute">
                    <span className="pf-attr-span">
                        <div className="pf-name">{data.name}</div>
                        <div className="pf-shot-count">Shots {contained}</div>
                    </span>
                    <ShotFooterLikePreview data={data} unLikeShot={this.props.unLikePortfolio} likeShot={this.props.likePortfolio} />
                    
                </div>
                }
                
            </div>
            {this.state.showModal?
                
                <ShotModalView openModalView={this.openModalView} slider={this.state.sliderRequired} totalShotCount={contained}
                getNext={this.getNext} getPrev={this.getPrev} />
                
                :
                ""
            }
            
        </React.Fragment>
        );
}

    }
    

export default Portfolio;