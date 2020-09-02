import React from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {defaultSuggestionsFilter} from "draft-js-mention-plugin";
import editorStyles from "../assets/css/editorStyles.module.css";
import mentions from "./mentions";
import "draft-js-mention-plugin/lib/plugin.css";
import mentionStyles from '../assets/css/mention.module.css';

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.mentionPlugin = createMentionPlugin({mentionPrefix: "@", theme: mentionStyles});
    this.hashtagPlugin = createMentionPlugin({mentionPrefix: "#", mentionTrigger:'#', theme: mentionStyles});
  }

  state = {
    editorState: EditorState.createEmpty(),
    mSuggestions: mentions,
    hSuggestions: mentions,
  };

  onChange = editorState => {
    this.setState({ editorState });
    if(this.props.onChange){
        this.props.onChange(editorState)
    }
  };

  onSearchChange = ({ value }) => {
      console.log("onSearchChange", value)
    this.setState({
        mSuggestions: defaultSuggestionsFilter(value, mentions)
    });
  };

  onhashSearchChange = ({ value }) => {
    this.setState({
        hSuggestions: defaultSuggestionsFilter(value, mentions)
    });
  };

  onExtractData = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    console.log(raw);
  };

  onExtractMentions = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    let mentionedUsers = [];
    for (let key in raw.entityMap) {
      const ent = raw.entityMap[key];
      if (ent.type === "mention") {
        mentionedUsers.push(ent.data.mention);
      }
    }
    console.log(mentionedUsers);
  };

  getAreaId = () =>{
    return this.props.id? this.props.id: 'editor-default'
}

  render() {
    const plugins = [this.mentionPlugin, this.hashtagPlugin];
    return (
      <React.Fragment>
        <div className={editorStyles.editor} id={this.getAreaId()}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
          />
          <this.mentionPlugin.MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.mSuggestions}
            entryComponent={MentionEntryTemplate}
          />
          <this.hashtagPlugin.MentionSuggestions
            onSearchChange={this.onhashSearchChange}
            suggestions={this.state.hSuggestions}
            entryComponent={TagEntryTemplate}
          />
        </div>
        {/* <div>
          <button onClick={() => this.onExtractData()}>Extract data</button>
          <button onClick={() => this.onExtractMentions()}>
            Extract mentions
          </button>
        </div> */}
      </React.Fragment>
    );
  }
}



const MentionEntryTemplate = (props) => {
    const {
      mention,
      theme,
      searchValue, // eslint-disable-line no-unused-vars
      isFocused, // eslint-disable-line no-unused-vars
      ...parentProps
    } = props;
  
    return (
      <div {...parentProps}>
        <div className={theme.mentionSuggestionsEntryContainer}>
          <div className={theme.mentionSuggestionsEntryContainerLeft}>
            <img
              src={mention.avatar}
              className={theme.mentionSuggestionsEntryAvatar}
              role="presentation"
              alt=""
            />
          </div>
  
          <div className={theme.mentionSuggestionsEntryContainerRight}>
            <div className={theme.mentionSuggestionsEntryTitle}>
              {mention.title}
            </div>
  
            <div className={theme.mentionSuggestionsEntryContent}>
              {mention.name}
            </div>
          </div>
        </div>
      </div>
    );
  };

const TagEntryTemplate = (props) =>{
    const {
        mention,
        theme,
        searchValue, // eslint-disable-line no-unused-vars
        isFocused, // eslint-disable-line no-unused-vars
        ...parentProps
      } = props;
    
      return (
        <div {...parentProps}>
          <div className={theme.mentionSuggestionsEntryContainerTag}>
            <div className={theme.mentionSuggestionsEntryContainerRight}>
              <div className={theme.mentionSuggestionsEntryTitle}>
                #{mention.name}
              </div>
    
              <div className={theme.mentionSuggestionsEntryContent}>
                100 posts
              </div>
            </div>
          </div>
        </div>
      );
}


export const ExtractToJSON = (editorState) =>{
  const contentState = editorState.getCurrentContent();
  const raw = convertToRaw(contentState);
  return raw
}

export const JSONToEditState = (rawState) =>{
  const editState = convertFromRaw(rawState);
  return editState
}

export default TextInput;
