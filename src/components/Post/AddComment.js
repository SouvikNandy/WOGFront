import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import TextInput from '../TextInput';

export default class AddComment extends Component {
    onSubmit = (comment) => {
        this.props.addComment(comment);
        document.getElementById("m-comment-form").reset();
    }

    render() {
        return (
            <React.Fragment>
                <form className="m-comment-form" id="m-comment-form">
                    <TextInput  id="m-add-cmnt" placeholder="Add a comment" 
                    commentBox={true}  onSubmit={this.onSubmit} initialMention={this.props.replyTo} rawEditorState={this.props.replyTo}
                    isAuth={this.props.isAuth} currLocation={this.props.currLocation} />
                </form>
            </React.Fragment>
        )
    }
}
