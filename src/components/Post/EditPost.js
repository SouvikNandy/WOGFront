import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import '../../assets/css/editpost.css';
import {ImageSlider} from './ShotModalView';
import OwlLoader from '../OwlLoader';
import HTTPRequestHandler from '../../utility/HTTPRequests';
import {AddDocumentForm} from './AddPost';
import { withRouter, Redirect } from 'react-router-dom';
import { createFloatingNotification } from '../FloatingNotifications';
import ImgCompressor from '../../utility/ImgCompressor';
import { checkNotEmptyObject } from '../../utility/Utility';


export class EditPost extends Component {
    state ={
        shot: null,
        showSideView : false,
        portfolioDeleted: false

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
        e.stopPropagation();
        this.props.history.goBack()
    }

    uploadPicture =(e) =>{
        ImgCompressor(e, this.makeUploadRequest)
    }

    makeUploadRequest=(compressedFile)=>{
        let url = 'api/v1/add-post/'
        let formData = new FormData();
        formData.append('attachments', compressedFile); 
        formData.append('portfolio_id', this.state.shot.id); 
        HTTPRequestHandler.put(
            {url:url, requestBody: formData, includeToken:true, uploadType: 'file', callBackFunc: this.addFileToState, errNotifierTitle:"Uploading failed !"})
        createFloatingNotification('warning', 'New shot is being uploaded', 
        "Your new shot is being uploaded, on completion will be added to your portfolio")
    }
    addFileToState = (data) =>{
        let shot = {...this.state.shot}
        shot.attachments.push(data.data)
        let noti_key = "Shot Added"
        let noti_msg = data.message
        this.setState({shot: shot})
        // create user notification
        createFloatingNotification('success', noti_key, noti_msg)
    }

    deleteShot = (shot_id)=>{
        let url = 'api/v1/add-post/?pid='+this.state.shot.id+'&sid='+shot_id;
        HTTPRequestHandler.delete(
            {url:url, includeToken: true, callBackFunc: this.succesOnDelete, })
        createFloatingNotification('warning', 'Shot getting deleted!', "Your shot will be deleted soon")
    }
    succesOnDelete = (data) =>{
        if(data.data=== "ALL"){
            // portfolio deleted
            this.setState({portfolioDeleted: true})
            createFloatingNotification('success', "Portfolio deleted", data.message)
        }
        else{
            let shot = {...this.state.shot}
            shot.attachments = shot.attachments.filter(ele => ele.id!==data.data)
            this.setState({shot: shot})
            createFloatingNotification('success', "Shot deleted", data.message)
        }
    }

    deletePortfolio =()=>{
        let url = 'api/v1/add-post/?pid='+this.state.shot.id;
        HTTPRequestHandler.delete(
            {url:url, includeToken: true, callBackFunc: this.succesOnDelete, })
        createFloatingNotification('warning', 'portfolio getting deleted!', "Your portfolio will be deleted soon")
    }

    updatePostDetails =(requestBody)=>{
        if(checkNotEmptyObject(requestBody)){
            console.log("processing request")
            let url = 'api/v1/add-post/';
            requestBody['portfolio_id']= this.state.shot.id; 
            HTTPRequestHandler.put(
                {url:url, requestBody: requestBody, includeToken:true,  
                callBackFunc: this.successfulUpdate, errNotifierTitle:"Uplading failed !"})
        }
        else{
            console.log("put request not fired")
        }

    }
    successfulUpdate =(data)=>{
        createFloatingNotification('success' ,'Your shots have been updated!', data.message);
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
        // console.log("pricing_container", this.state.shot.pricing_container)
        return (
            <div className={this.state.showSideView?"bg-modal with-side-width": "bg-modal full-width"}>
                <div className={this.state.showSideView?"edit-container edit-container-resize": "edit-container"} >
                    <div className={this.state.showSideView?"edit-container-top-hide": "edit-container-top"}>
                        <div className="modal-imgbox">
                            <ImageSlider attachments={this.state.shot.attachments} actionBtn={true} 
                            addShot={this.uploadPicture} deleteShot={this.deleteShot} deletePortfolio={this.deletePortfolio}
                            pricingContainer={this.state.shot.pricing_container}/>
                        </div>
                    </div>
                    <div className={this.state.showSideView?"edit-container-bottom edit-container-bottom-resize": "edit-container-bottom"}>
                        <AddDocumentForm sideViewOnChange={this.activeSideView} showModal={this.gotoPrev} 
                        portfolio_name={this.state.shot.portfolio_name} description={this.state.shot.description} 
                        location={this.state.shot.location} 
                        members ={this.state.shot.members}
                        updatePostDetails={this.updatePostDetails} 
                        FileList={this.state.shot.attachments} pricingContainer={this.state.shot.pricing_container}/>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default withRouter(EditPost);
