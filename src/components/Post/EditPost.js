import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import '../../assets/css/editpost.css';
import {ImageSlider} from './ShotModalView';
import OwlLoader from '../OwlLoader';
import HTTPRequestHandler from '../../utility/HTTPRequests';


export class EditPost extends Component {
    state ={
        shot: null,

    }
    componentDidMount(){
        let param = this.props.match.params.id
        let [username, portfolio_id, shot_id] = param.split("-");
        // get portfolio details
        let url = "api/v1/view-post/" + username + '/?q='+portfolio_id
        HTTPRequestHandler.get({url:url, includeToken:true, callBackFunc: this.updateStateOnAPIcall})
    }

    updateStateOnAPIcall = (data) =>{
        this.setState({shot: data.data })
    }

    render() {
        if(!this.state.shot){
            return(
                <div className="bg-modal full-width"><OwlLoader /></div>
                )
        }
        return (
            <div className="bg-modal full-width">
                <div className="edit-container">
                    <div className="edit-container-top">
                        <div className="modal-imgbox">
                            <ImageSlider attachments={this.state.shot.attachments} />
                        </div>

                    </div>
                    
                </div>
                
            </div>
        )
    }
}

export default EditPost
