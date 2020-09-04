import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';
import TextInput from '../TextInput';

export default class AddComment extends Component {
    state = {
        comment: ''
    }

    onSubmit = (e) => {
        e.preventDefault();
        let parent = document.getElementById("setparent").value;
        this.props.addComment(this.state.comment, parent);
        this.setState({ comment: '' });
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
                <form className="m-comment-form" id="m-comment-form" onSubmit={this.onSubmit}>
                    <TextInput  id="m-add-cmnt" onChange={this.onChange.bind(this, 'comment')} placeholder="Add a comment" 
                    commentBox={true} />
                    <input type="hidden" name="parent" id="setparent"></input>
                    <input type="submit" className="m-cmnt-submit" value="Post" />
                </form>
            </React.Fragment>
        )
    }
}
