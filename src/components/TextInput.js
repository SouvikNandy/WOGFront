import React from "react";
import { EditorState, convertToRaw, convertFromRaw, CompositeDecorator  } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {defaultSuggestionsFilter} from "draft-js-mention-plugin";
import 'draft-js/dist/Draft.css';
import "../assets/css/editorstyle.css";
// import "../assets/css/mention.css";
import mentions from "./mentions";
import "draft-js-mention-plugin/lib/plugin.css";
import mentionStyles from '../assets/css/mention.module.css';
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";

let positionSuggestionsThe  ={
	"bottom": "-50vh", "position": "absolute"
}

const mentionPlugin = createMentionPlugin({mentionPrefix: "@", theme: mentionStyles, positionSuggestionsThe});
const hashtagPlugin = createMentionPlugin({mentionPrefix: "#", mentionTrigger:'#', theme: mentionStyles});

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    
	this.mentionPlugin = mentionPlugin;
	this.hashtagPlugin = hashtagPlugin;
  }

  state = {
	editorState: null,
	mSuggestions: mentions,
	hSuggestions: mentions,
  };

  componentDidMount(){
      if(this.props.editorState){
          this.setState({editorState: JSONToEditState(JSON.parse(this.props.editorState))})
      }
      else{
        this.setState({editorState:EditorState.createEmpty()})
      }
  }

  onChange = editorState => {
	this.setState({ editorState });
	if(this.props.onChange){
		this.props.onChange(editorState)
	}
  };

  onSearchChange = ({ value }) => {
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
    if(!this.state.editorState){ return (<React.Fragment></React.Fragment>)}
	const plugins = [this.mentionPlugin, this.hashtagPlugin];
	return (
	  <React.Fragment>
		<div className="editor" id={this.getAreaId()}>
		  <Editor
			editorState={this.state.editorState}
			onChange={this.onChange}
			plugins={plugins}
			placeholder={this.props.placeholder? this.props.placeholder: ""}
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
	console.log("MentionEntryTemplate", props)
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


function getPluginDecoratorArray() {
    let decorators = [];
    let plugin;
    let listOfPlugins = [mentionPlugin, hashtagPlugin];
    // check each plugin that will be used in the editor for decorators
    // (retrieve listOfPlugins however makes sense in your code)
    for (plugin of listOfPlugins) {
        if (plugin.decorators !== null && plugin.decorators !== undefined) {
            // if the plugin has any decorators, add them to a list of all decorators from all plugins
            decorators = decorators.concat(plugin.decorators);
        }
    }
    return decorators;
}

function getDecorators() {
    // I can't quite remember why I had to wrap things in this exact way, but found that I ran into
    // errors if I did not both have a MultiDecorator and a CompositeDecorator wrapping
    // This MultiDecorator can now be used as shown in my previous post.
    return new MultiDecorator([new CompositeDecorator(getPluginDecoratorArray())]);
}


export const JSONToEditState = (rawState) =>{
    let decorator = getDecorators()
	const editState = EditorState.createWithContent(convertFromRaw(rawState), decorator );
	return editState
}

export const EditorSpan = (editorState, readOnly=true) =>{
	return (
        <div className="editor">
            <Editor editorState={editorState} readOnly={readOnly} />
        </div>
    )
}

export default TextInput;
