import React, { Component } from 'react';
import "../../assets/css/addpost.css";
import '../../assets/css/stickyBoard.css';

import { FaPlus } from 'react-icons/fa';
import {generateId, getCurrentTimeInMS, timeDifference} from '../../utility/Utility';


export class StickyBoard extends Component {
    state ={
        notes : [
            {id:1, title: "Demo title 1", body : "where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", username: "1amsid", "created_at": 1600172582, delete_perm: true},
            {id:2, title: "Demo title 2", body : "where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book.", username: "1amsid", "created_at": 1600172582, delete_perm: false }
        ],
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
    }
    addNote = (record) =>{
        this.setState({notes: [record, ...this.state.notes ]})
    }
    removeNote = (idx) =>{
        this.setState({
            notes: this.state.notes.filter(ele => ele.id!==idx)
        })
    }
    render() {
        let allNotes = [];
        this.state.notes.map(ele =>{
            allNotes.push(
                <StickyNotes key={ele.id} data={ele} removeNote={this.removeNote.bind(this, ele.id)} username={this.props.username} published={true} 
                isAuth={this.props.isAuth}/>
            )
            return ele
        })

        return (
            <div className="sticky-board">
                {allNotes}
                {this.props.isAuth? <AddNoteBTN  addNote={this.addNote} username={this.props.username} isAuth={this.props.isAuth}/>: ""}
                
                
            </div>
        )
    }
}


export class StickyNotes extends Component{
    state ={
        title: '',
        body: '',
        deleteConfirmation: false
    }
    showDeleteConfirmation = () => this.setState({deleteConfirmation: !this.state.deleteConfirmation})

    onChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    pinNote = () =>{
        let newRecord = {"title": this.state.title, "body": this.state.body, "id": generateId(), "username": this.props.username, 
        "created_at": getCurrentTimeInMS()}
        this.props.addNote(newRecord);
        document.getElementById("note-title").value ="";
        document.getElementById("note-body").value ="";
        this.setState({title: "", body: ""})
    }

    render(){
        return(
            <div className="sticky-notes">
                <div className="note-text">
                    {this.props.data?
                    <React.Fragment>
                        <div className="note-title">
                            <span>{this.props.data.title}</span>
                            {this.props.published?
                                <span className="note-identitity">by {this.props.data.username}, {timeDifference(this.props.data.created_at)}</span>
                                :
                                ""
                            }
                            
                            </div>
                        <div className="note-body">{this.props.data.body}</div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <input type="text" placeholder="Enter a title here" name="title" id="note-title" onChange={this.onChange}/>
                        <textarea placeholder="Add your suggestion" name="body" id="note-body" onChange={this.onChange}/>
                    </React.Fragment>
                    }
                    
                </div>
                <div className= "notes-bottom">
                    {this.props.isAuth && this.props.published?
                        this.state.deleteConfirmation? 
                            <div className="delete-options">
                                <span>Continue delete?</span>
                                <span className="e-opt" onClick={this.props.removeNote}>Yes</span>
                                <span className="e-opt" onClick={this.showDeleteConfirmation}>No</span>
                            </div>
                            :
                            this.props.data.delete_perm?
                            <button className="btn pin-btn" onClick={this.showDeleteConfirmation}>Remove</button>
                            :
                            ""
                        :
                        this.props.isAuth? 
                        <button className="btn pin-btn" onClick={this.pinNote}>Pin</button>
                        :
                        ""
                    }
                </div>
                

            </div>
        )
    }
}


export class AddNoteBTN extends Component {
    state = {
        isModalOpen: false
    }

    showModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isModalOpen?
                <div className="add-notes-modal">
                    <StickyNotes addNote={this.props.addNote} username={this.props.username} isAuth={this.props.isAuth}/>
                </div>
                :
                ""
                }
                
                <button className="camera-cover" onClick={this.showModal} >
                    <FaPlus className="camera-icon" />
                </button>   

            </React.Fragment>
        );

    }

}
export default StickyBoard
