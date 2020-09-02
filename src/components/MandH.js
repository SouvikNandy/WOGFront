import React, { Component } from 'react';
import '../assets/css/mandh.css';

const userList = [
    {'id': 1, "username": 'johndoe', "name": "John Doe"},
    {'id': 2, "username": 'maek', "name": "Mark Doe"},
    {'id': 2, "username": 'jenny', "name": "Jenny Doe"},
]

const hashList = [
    {'id': 1, "phase": 'kolkata', "count": 100},
    {'id': 2, "phase": 'konarak', "count": 50},
    {'id': 2, "phase": 'howarh', "count": 150},
]

export class MandH extends Component {
    state ={
        showContent: '',
        linkIndexArr: [],
        searchPhase: '',
        searchedPhase: false,
        output: [],
        targetChar : '',
        lastSearchedChar : ''
    }

    getLastChar = (val) =>{
        return val[val.length -1]
    }

    preventBackspace =(e) =>{
        var key = e.key;
        // for pc only. yet to check on mobile devices
        if (key === "Backspace" || key === "Delete"){
            let lastChar = this.getLastChar(e.target.value)
            if(lastChar === "@" || lastChar === "#"){
                console.log("deleted", lastChar)
                let currLinks = this.state.linkIndexArr
                currLinks.pop()
                this.setState({showSuggestions: false, targetChar: '', linkIndex: currLinks})
            }
        }
       
    }

    searchSuggestions = (value)=> {
        let phase = value.toLowerCase();
        if(!phase){
            // show last filtered results
            return true
        }
        let matched = ''
        if (this.state.targetChar === "@"){
            matched = userList.filter(item => item.username.toLowerCase().startsWith(phase));

        }
        else{
            matched = hashList.filter(item => item.phase.toLowerCase().startsWith(phase));

        }
        this.setState({
            output: matched,
            searchedPhase: value,
            lastSearchedChar: this.state.targetChar
        })

    }

    onChange = (e) =>{
        let lastChar = this.getLastChar(e.target.value);
        if(lastChar === "@" || lastChar === "#"){
            let currLinkIndex = e.target.value.length-1;
            let currLinks = this.state.linkIndexArr
            let if_exists =  currLinks.filter(ele=> ele[1] === currLinkIndex)
            if(if_exists.length>0){
                // in this case some text deleted after @/# and now the last char is again @/#
                return true
            }
            console.log("entered", lastChar)
            // coverage case : user put multiple @ or #
            let secondLastChar = e.target.value[e.target.value.length -1]
            if (secondLastChar === "@" || secondLastChar === "#"){
                let showContent = this.state.showContent + secondLastChar
                this.setState({showContent: showContent})
            }
            // store index position of @ or # in [targetKey, startingIndex, endIndex] format
            let indexLoc =[lastChar, e.target.value.length-1]
            // check if last element having [targetKey, startingIndex, endIndex] else remove that 
            if (currLinks.length> 0 && currLinks[currLinks.length -1].length < 3){
                currLinks.pop()
            } 
            currLinks.push(indexLoc)

            this.setState({showSuggestions: true, 
                targetChar: lastChar,
                linkIndex: currLinks
            })
        }
        else if (this.state.showSuggestions === true &&  /\s/.test(lastChar)){
            this.setState({showContent: e.target.value, showSuggestions: false})
        }

        else if(this.state.showSuggestions === true){
            let searchKey = e.target.value.substring(e.target.value.lastIndexOf(this.state.targetChar) + 1, e.target.value.length);
            console.log("searchKey",searchKey);
            this.searchSuggestions(searchKey)
            return true
        }
        else{
            this.setState({showContent: e.target.value})
            this.props.onChange(e.target.value)
        }
    }

    getAreaId = () =>{
        return this.props.id? this.props.id: 'm-and-h'
    }

    createCommentLink = (ele, targetChar) =>{
        // let comp = ''
        // let ulink = ''
        let innerText = ''
        if (targetChar === "@"){
            // ulink = "/profile/"+ ele.username;
            innerText = ele.username
        }
        else{
            // ulink = "/explore/?q=" + ele.phase
            innerText = ele.phase
        }
        // comp = "<a href='" + ulink + "' className='link-span'>" + innerText +"</a>"
        let showText = this.state.showContent + innerText;
        // store end index position of @ or #
        let currLinks = this.state.linkIndexArr;
        let endIndex = currLinks[currLinks.length - 1][1] + innerText.length;
        currLinks[currLinks.length - 1].push(endIndex)

        console.log("showText", showText, currLinks);
        let targetDom = document.getElementById(this.getAreaId());
        targetDom.value = showText;
        targetDom.focus();
        this.setState({showContent: showText, showSuggestions: false, linkIndexArr: currLinks})
        this.props.onChange(showText)


    }

    render() {
        return (
            <div className="m-h-box">
                <textarea
                id={this.getAreaId()} 
                defaultValue={this.state.content}
                onKeyDown={this.preventBackspace} onChange={this.onChange}>
                </textarea>
                
                {this.state.showSuggestions && this.state.output.length > 0 && this.state.targetChar === this.state.lastSearchedChar?
                <div className="sg-box">
                   {this.state.output.map(ele=>{
                       return(
                           this.state.targetChar === "@"? 
                                <div className="sg-row" key={ele.id} onClick={this.createCommentLink.bind(this, ele, '@')}>
                                    <div className="sg-img"></div>
                                    <div className="sg-context">
                                            <span className="ct-top">{ele.name}</span>
                                            <span className="ct-bottom">{ele.username}</span>
                                    </div>
                                </div>
                           :
                           <div className="sg-row" key={ele.id} onClick={this.createCommentLink.bind(this, ele, '#')}>
                                <div className="sg-context-hash">
                                        <span className="ct-top">{ele.phase}</span>
                                        <span className="ct-bottom">{ele.count} posts</span>
                                </div>
                            </div>

                        
                       )
                   })}
                </div>
                :
                ""  
                }
                
            </div>
        )
    }
}

export default MandH
