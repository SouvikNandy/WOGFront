import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import TextInput from '../TextInput';

export default class AddComment extends Component {
    onSubmit = (comment) => {
        let parent = document.getElementById("setparent").value;
        this.props.addComment(comment, parent);
        // form reset doesnot clear hidden field values
        document.getElementById("setparent").value = '';
        document.getElementById("m-comment-form").reset();
    }

    onChange = (key, val) => this.setState({
        [key] : val
    })

    render() {
        return (
            <React.Fragment>
                <form className="m-comment-form" id="m-comment-form">
                    <TextInput  id="m-add-cmnt" placeholder="Add a comment" 
                    commentBox={true}  onSubmit={this.onSubmit} />
                    <input type="hidden" name="parent" id="setparent"></input>
                </form>
            </React.Fragment>
        )
    }
}
