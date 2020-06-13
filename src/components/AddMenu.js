import React, {Component} from 'react';
import "../assets/css/cambtn.css";
import { FaCameraRetro, FaPlus } from 'react-icons/fa';


export class AddMenu extends Component {
    state = {
        isModalOpen: false
    }

    showModal =() =>{
        this.setState({isModalOpen: !this.state.isModalOpen})
    }

    render(){
        return(
            <React.Fragment>
                {/* {this.state.isModalOpen? <AddDocumentForm />:''} */}
                <AddDocumentForm />
                <button className="camera-cover" onClick={this.showModal}>
                <FaCameraRetro className="camera-icon"/>
                <FaPlus className="cam-plus"/>
                </button>
    
            </React.Fragment>
        );

    }
    
}


class AddDocumentForm extends Component{
    state = {
        FileList: []
    }

    onFileSelect = (e) =>{ 
        this.setState({
            "FileList": [...e.target.files]
        });
        console.log(e.target.files)
        // console.log(e.target.files.length + " files Selected")


    }


    render(){
        const uploadedFilePreviewList = [];
        if(this.state.FileList.length>0){
            var currUrl = this.state.FileList.map(file =>
                <div className="uploaded-preview-div">
                    <img className="uploaded-preview-img" src={URL.createObjectURL(file)}></img>
                </div>
            
                    
            );
            
            uploadedFilePreviewList.push(currUrl);
        }


        return(
            <React.Fragment>
                <div className="doc-form">
                    <form className="img-upload-form">
                        <section className="doc-head">
                            <div className="top-logo">
                                <FaCameraRetro className="cam-logo"/>
                            </div>
                            
                        </section>
                        <section className="doc-body">
                            <label>Portfolio Name</label>
                            <input type="text" id="fname" name="fname"  />
                            <label>Description</label>
                            <textarea  type="text" id="lname" name="lname"/>
                            <label>Members</label>
                            <input type="text" id="memo" name="memo"  />
                            <label>Attachments</label>
                            {this.state.FileList.length>0 ?
                            <div className="uploaded-preview">
                                    {uploadedFilePreviewList}
                            </div>
                            : 
                            ""
                            }
                            <div className="select-doc">
                                <input type="file" className="file-selector" name="FileList"  multiple="multiple" onChange={this.onFileSelect}/>
                                {this.state.FileList.length>0 ?
                                <span id="file-count">{this.state.FileList.length} files selected</span>
                                :
                                <span id="file-count">Browse from device</span>
                                }
                                
                            </div>
                            
                        </section>
                        <section className="doc-btn">
                            <input type="submit" value="Submit" />
                        </section>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default AddMenu;