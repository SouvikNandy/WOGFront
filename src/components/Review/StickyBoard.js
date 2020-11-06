import React, { Component } from 'react';
import "../../assets/css/addpost.css";
import '../../assets/css/stickyBoard.css';

import { FaPlus } from 'react-icons/fa';
import {generateId, getCurrentTimeInMS, timeDifference} from '../../utility/Utility';
import OwlLoader from '../OwlLoader';
import Paginator from '../../utility/Paginator';
import { AddSuggestionAPI, DeleteSuggestionAPI, UserSuggestionAPI } from '../../utility/ApiSet';
import {GoVerified} from 'react-icons/go';


export class StickyBoard extends Component {
    state ={
        notes: null,
        paginator: null,
        isFetching: false,
        eventListnerRef: null,
    }
    componentDidMount(){
        UserSuggestionAPI(this.updateStateOnAPIcall)
        let eventListnerRef = this.handleScroll.bind(this);
        this.setState({
            eventListnerRef: eventListnerRef
        })
        window.addEventListener('scroll', eventListnerRef);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.state.eventListnerRef);
        
    }

    updateStateOnAPIcall = (data)=>{
        this.setState({
            notes : data.results,
            paginator: data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        })
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            notes:[...results , ...this.state.notes],
            isFetching: false
        })
    }

    addNote = (record) => AddSuggestionAPI(record, this.addOnSuccess.bind(this, record))

    addOnSuccess = (record) => this.setState({notes: [record, ...this.state.notes ]})

    removeNote = (idx) =>DeleteSuggestionAPI(idx, this.deleteOnSuccess.bind(this, idx))
        
    deleteOnSuccess = (idx) => this.setState({ notes: this.state.notes.filter(ele => ele.id!==idx)})

    render() {
        if (!this.state.notes) return(<div className="sticky-board"><OwlLoader /></div>)
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
        let newRecord = {"title": this.state.title, "body": this.state.body, 
        "id": generateId(), "username": this.props.username, "created_at": getCurrentTimeInMS(), 
        is_approved: false, delete_perm: true}
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
                            {this.props.data.is_approved? <GoVerified  className="verified" /> : ""}
                            
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
