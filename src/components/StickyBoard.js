import React, { Component } from 'react';
import '../assets/css/stickyBoard.css';

export class StickyBoard extends Component {
    state ={
        notes : [
            {id:1, tilte: "Demo title 1", body : "where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book."},
            {id:2, tilte: "Demo title 2", body : "where entrepreneurs can easily find the right design for their company.The book cover for us was a very important part of the success of the book."}
        ],
    }
    render() {
        let allNotes = [];
        this.state.notes.map(ele =>{
            allNotes.push(
                <StickyNotes key={ele.id} data={ele} />
            )
            return ele
        })

        return (
            <div className="sticky-board">
                {allNotes}
                
            </div>
        )
    }
}


export class StickyNotes extends Component{
    render(){
        return(
            <div className="sticky-notes">
                <div className="note-text">
                    <input type="text" placeholder="Enter a title here" />
                    <textarea placeholder="Add your suggestion"/>
                </div>
                <div className= "notes-bottom">
                    <button className="btn pin-btn" >Pin</button>
                </div>
                

            </div>
        )
    }
}
export default StickyBoard
