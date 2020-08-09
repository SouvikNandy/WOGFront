import React, { Component } from 'react';
import '../../assets/css/shotmodalview.css';

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

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });
    render() {
        return (
            <React.Fragment>
                <form className="m-comment-form" id="m-comment-form" onSubmit={this.onSubmit}>
                    <textarea className="m-add-cmnt" name="comment" id="m-add-cmnt"
                        placeholder="Add a comment" onChange={this.onChange} required ></textarea>
                    <input type="hidden" name="parent" id="setparent"></input>
                    <input type="submit" className="m-cmnt-submit" value="Post" />
                </form>
            </React.Fragment>
        )
    }
}
