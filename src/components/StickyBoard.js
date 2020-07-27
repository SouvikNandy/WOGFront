import React, { Component } from 'react';
import "../assets/css/addpost.css";
import '../assets/css/stickyBoard.css';

import { FaPlus } from 'react-icons/fa';
import {generateId} from '../utility/Utility';


export class StickyBoard extends Component {
    state ={
        notes : [
            {id:1, title: "Demo title 1", body : "where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book."},
            {id:2, title: "Demo title 2", body : "where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book."}
        ],
    }
    addNote = (record) =>{
        this.setState({notes: [...this.state.notes, record]})
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
                <StickyNotes key={ele.id} data={ele} removeNote={this.removeNote.bind(this, ele.id)}/>
            )
            return ele
        })

        return (
            <div className="sticky-board">
                {allNotes}
                <AddNoteBTN  addNote={this.addNote} />
                
            </div>
        )
    }
}


export class StickyNotes extends Component{
    state ={
        title: '',
        body: ''
    }

    onChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    pinNote = () =>{
        let newRecord = {"title": this.state.title, "body": this.state.body, "id": generateId()}
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
                        <div className="note-title">{this.props.data.title}</div>
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
                    {this.props.data?
                        <button className="btn pin-btn" onClick={this.props.removeNote}>Remove</button>
                        :
                        <button className="btn pin-btn" onClick={this.pinNote}>Pin</button>
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
                    <StickyNotes addNote={this.props.addNote}/>
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
