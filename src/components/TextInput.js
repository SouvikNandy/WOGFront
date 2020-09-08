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
import {isAuthenticated} from '../utility/Utility';
import { Redirect } from "react-router-dom";

let positionSuggestionsDef = (settings) => {
    return {
      left: window.innerWidth >1100? settings.decoratorRect.left: 0,
      right: window.innerWidth >1100? settings.decoratorRect.right: 0,
      top: settings.decoratorRect.top + 25 + 'px',
      display: 'block',
      position: 'fixed',
      transformOrigin: '1em 0% 0px',
      transition: 'all 0.25s cubic-bezier(0.3, 1.2, 0.2, 1)',
      color: 'black',
      'width': window.innerWidth >1100?'20vw': '100%',
      'max-height': '40vh',
      'overflow-y': 'scroll'

    }
  }

const mentionPlugin = createMentionPlugin({mentionPrefix: "@", theme: mentionStyles, positionSuggestions: positionSuggestionsDef});
const hashtagPlugin = createMentionPlugin({mentionPrefix: "#", mentionTrigger:'#', theme: mentionStyles});

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    
	    this.mentionPlugin = mentionPlugin;
        this.hashtagPlugin = hashtagPlugin;
        this.setDomEditorRef = ref => this.domEditor = ref;
        this.focus = () => this.domEditor.focus();
  }

    state = {
        editorState: null,
        mSuggestions: mentions,
        hSuggestions: mentions,
        loggedIn: null,
        // for replying user
        prevInitialMention: null

    };

    componentDidMount(){
        if(this.props.editorState){
            this.setState({editorState: JSONToEditState(JSON.parse(this.props.editorState))})
        }
        else if (this.props.rawEditorState){
            this.setState({editorState: this.props.rawEditorState})
        }
        else{
            this.setState({editorState:EditorState.createEmpty()})
        }
        if (this.props.commentBox){
            let positionSuggestions = (settings) => {
                return {
                left: window.innerWidth >1100? '58vw': 0,
                right: window.innerWidth >1100? '10vw': 0,
                top: settings.decoratorRect.top - 20 + 'px',
                display: 'block',
                transform: 'scale(1) translateY(-100%)',
                transformOrigin: '1em 0% 0px',
                transition: 'all 0.25s cubic-bezier(0.3, 1.2, 0.2, 1)',
                position: 'fixed',
                color: 'black',
                'width': window.innerWidth >1100?'28.5vw': '100%',
                'max-height': '70vh',
                'overflow-y': 'scroll'

                }
            }
            this.mentionPlugin = createMentionPlugin({mentionPrefix: "@", theme: mentionStyles, positionSuggestions});
            this.hashtagPlugin = createMentionPlugin({mentionPrefix: "#", mentionTrigger:'#', theme: mentionStyles, positionSuggestions}); 
            setTimeout(() => {
                this.focus();
            }, 1000);
                 
        }
    }

    onChange = editorState => {
        this.setState({ editorState });
        // check if editorState text is empty then reset
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

    onSubmit = (e) => {
      e.preventDefault();
      let _authenticated = isAuthenticated()
      if (!_authenticated){
        this.setState({ editorState: EditorState.createEmpty(), loggedIn: false});
        return false
      }
      let cmntJson = ExtractToJSON(this.state.editorState)
      // console.log(cmntJson.blocks[0].text, !cmntJson.blocks[0].text)
      if (!cmntJson.blocks[0].text){
          return false
      }
      // console.log(cmntJson)
      this.props.onSubmit(this.state.editorState);
      this.setState({ editorState: EditorState.createEmpty(), initialMentionTaken: false});

  }
  
  getEditorStateInRender = ()=>{
      if (this.props.initialMention){

        if(!this.state.prevInitialMention || (this.state.prevInitialMention &&
            this.state.prevInitialMention["blocks"][0]["key"]!== ExtractToJSON(this.props.initialMention)["blocks"][0]["key"])){
                this.setState({
                    // editorState: EditorState.push(
                    //   this.state.editorState,
                    //   this.props.initialMention,
                    //   'replace',
                    // )
                    editorState: this.props.initialMention,
                    prevInitialMention: ExtractToJSON(this.props.initialMention)
                  })
            }

      }
      return this.state.editorState

  }

  render() {
    if(!this.state.editorState){ return (<React.Fragment></React.Fragment>)}
    if(this.state.loggedIn === false){return(<Redirect to={{ pathname: "/signin/" }}/>)}
    const plugins = [this.mentionPlugin, this.hashtagPlugin];
    this.getEditorStateInRender()

	return (
	  <React.Fragment>
        <div className="editor" id={this.getAreaId()}>
          <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
                placeholder={this.props.placeholder? this.props.placeholder: ""}
                ref={this.setDomEditorRef}
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
        {this.props.onSubmit?
          <button className="m-cmnt-submit"  onClick={this.onSubmit} >Post</button>
        :
          ""
        }
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
