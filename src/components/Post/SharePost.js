import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import '../../assets/css/editpost.css';
import {ImageSlider} from './ShotModalView';
import OwlLoader from '../OwlLoader';
import HTTPRequestHandler from '../../utility/HTTPRequests';
import {ShareDocumentForm} from './AddPost';
import { withRouter, Redirect } from 'react-router-dom';


export class SharePost extends Component {
    state ={
        shot: null,
        showSideView : false
    }
    componentDidMount(){
        let param = this.props.match.params.id
        param = param.split("-");
        let username = param[0]
        let portfolio_id = param[1]
        // get portfolio details
        let url = "api/v1/view-post/" + username + '/?q='+portfolio_id+'&r='+700
        HTTPRequestHandler.get({url:url, includeToken:true, callBackFunc: this.updateStateOnAPIcall})
    }

    updateStateOnAPIcall = (data) =>{
        this.setState({shot: data.data })
    }

    activeSideView = (stateVal) =>{
        this.setState({showSideView: stateVal})
    }
    gotoPrev = (e) => {
        // e.stopPropagation();
        this.props.history.goBack()
    }

    render() {
        if(this.state.portfolioDeleted){
            return <Redirect to={{ 
                pathname: "/user-profile/"+this.state.shot.user.username, 
                state: {rerender: 'Shots'}
         }} />
        }
        if(!this.state.shot){
            return(
                <div className="bg-modal full-width"><OwlLoader /></div>
                )
        }

        console.log("state", this.state.shot)
        let prentPostId = this.state.shot.is_shared_content?this.state.shot.actual_post.id: this.state.shot.id
        
        return (
            <React.Fragment>
                <div className={this.state.showSideView?"bg-modal with-side-width": "bg-modal full-width"}>
                    <div className={this.state.showSideView?"edit-container edit-container-resize": "edit-container"} >
                        <div className={this.state.showSideView?"edit-container-top-hide": "edit-container-top"}>
                            <div className="modal-imgbox modal-imgbox-fullwidth">
                                <ImageSlider attachments={this.state.shot.attachments} actionBtn={false} showUser={this.state.shot.user}/>
                            </div>
                        </div>
                        <div className={this.state.showSideView?"edit-container-bottom edit-container-bottom-resize": "edit-container-bottom"}>
                            <ShareDocumentForm sideViewOnChange={this.activeSideView} showModal={this.gotoPrev} prentPostId={prentPostId}/>
                        </div>
                    </div>
                </div>
                
            </React.Fragment>
        )
    }
}

export default withRouter(SharePost);
