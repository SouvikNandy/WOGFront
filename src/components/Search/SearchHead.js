import React, {Component} from 'react';
import GoBack from "../GoBack";
import SearchBar from "./SearchBar";
import {FaHashtag} from "react-icons/fa";
import {AiFillCloseCircle} from 'react-icons/ai';

import pl2 from "../../assets/images/people/2.jpg";

// sample dataset
const userlist = [
    {id: 1, name: "konika Sen Sharma", username: "hellokonika", profile_pic: pl2},
    {id: 2, name: "jahn doe", username: "johndoe", profile_pic: pl2},
    {id: 3, name: "jane doe", username: "jane doe", profile_pic: pl2},
    {id: 4, name: "mike hussy", username: "mike", profile_pic: pl2},
    {id: 5, name: "david miller", username: "killermiller", profile_pic: pl2},
]

const hashtag = [
    {id:1,  phase: '#goodVibes', category: "hashtag"},
    {id:2,  phase: '#kolkata', category: "hashtag"},
    {id:3,  phase: '#jamaica', category: "hashtag"},
]




export default class SearchHead extends Component {
    state = {
        searchDropDown : false,
        recentSearch : [
            {id:1,  phase: '#goodVibes', category: "hashtag"}, 
            {id:2,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:3,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:4,  phase: '#goodVibes', category: "hashtag"}, 
            {id:11,  phase: '#goodVibes', category: "hashtag"}, 
            {id:12,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:13,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:14,  phase: '#goodVibes', "category": "hashtag"}, 
        ],
        // newResult: [],
        showList: [],
        searchedVal: '',
        filteredCategory: 'user'

    }

    openDropDown = () =>{
        this.setState({searchDropDown: true})
    }

    closeDropDown = () =>{
        this.setState({searchDropDown: false})
    }

    searchOnChange = (val) =>{
        this.setState({
            searchedVal: val,
            showList: userlist.filter(ele=> ele.name.startsWith(val)),
            // newResult: userlist.filter(ele=> ele.name.startsWith(val)),
        })

    }

    removeFromRecent = (idx) =>{
        if (idx === "all"){
            this.setState({
                recentSearch : []
            })
        }
        else{
            this.setState({
                recentSearch : this.state.recentSearch.filter(ele => ele.id !== idx)
            })

        }
        
    }

    filterBy = (key) =>{
        if (this.state.showList.length < 1){
            // filter on recentSearch
            this.setState({showList: this.state.recentSearch.filter(ele => ele.category === key)})
        }
        else if (key === "user"){
            this.setState({
                showList: userlist.filter(ele=> ele.name.startsWith(this.state.searchedVal)),
                filteredCategory: key
            })
        }
        else if (key === "hashtag"){
            let allHashtags = [];
            hashtag.map(ele=> {
                let hashStrippedPhase = ele.phase.replace(/#/, '');
                let hashStrippedSearchVal = this.state.searchedVal.replace(/#/, '');
                if (hashStrippedPhase.startsWith(hashStrippedSearchVal)){
                    allHashtags.push(ele)
                }
                return ele
                }
                
            )
            this.setState({
                showList: allHashtags,
                filteredCategory: key
            })
        }
        else if (key === "location"){

        }

    }

    render(){
        
        let content = "";
        if (this.state.showList.length< 1){
            content = <RecentSearchPalette 
            data={this.state.showList.length>0 ? this.state.showList: this.state.recentSearch} 
            removeFromRecent={this.removeFromRecent} />

        }
        else{
            content = <SearchResultPalette data={this.state.showList} category={this.state.filteredCategory} />
        }
        console.log("showlist on render", this.state.showList, content);
        return (
            <React.Fragment>
                <div className="srch-box">
                    <div className="back-div">
                        <GoBack />
                    </div>
                    <SearchBar searchDropDown={this.state.searchDropDown} 
                    openDropDown={this.openDropDown}
                    closeDropDown={this.closeDropDown}
                    dropdownContent={content}
                    filterBy={this.filterBy}
                    searchOnChange={this.searchOnChange}
                    defaultSearch={true}
                    
                    />
                </div>
    
            </React.Fragment>
        )

    }
    
}

export function RecentSearchPalette(props){
    let resultBlock = [];
    if (props.data.length > 0){
        props.data.map(item =>{
            if(item.category === "user"){
                resultBlock.push(
                    <div className="s-recent-div" key={item.id}>
                        <img src={item.profile_pic} alt="" className="u-img" />
                        <div className="recent-identity">
                            <span className="u-name">{item.name}</span>
                            <span className="u-user">{item.username}</span>
                        </div>
                        <AiFillCloseCircle className="close-btn" onClick={() => props.removeFromRecent(item.id)}/>
                    </div>
                )
    
            }
            else{
                resultBlock.push(
                    <div className="s-recent-div" key={item.id}>
                        <div className="hash-circle">
                            <FaHashtag className="hash-icon" />
                        </div>
                        <div className="recent-identity">
                            <span className="u-name">{item.phase}</span>
                        </div>
                        <AiFillCloseCircle className="close-btn" onClick={() => props.removeFromRecent(item.id)}/>
                    </div>
                )
    
            }
            return item
        })

    }
    else{
        resultBlock.push(
            <div className="no-recent">
                <sapn>
                No previous searches
                </sapn>

            </div>
            
        )
    }

    
    return(
        <React.Fragment>
            <div className="recent-search-div-top">
                <span className="heading">Recent</span>
                {props.data.length > 0?
                    <span className="clear-all" onClick={() => props.removeFromRecent("all")}>Clear all</span>
                    :
                    ""
                }
                
            </div>
            <div className="recent-search-div">
                {resultBlock}
            </div>

        </React.Fragment>
        
    )
}


export function SearchResultPalette(props){
    let resultBlock = [];
    let heading = '';
    if (props.category === "user"){
        heading = "People"
    }
    else if (props.category === "hashtag"){
        heading = "Hashtags"
    }
    if (props.data.length > 0){
        props.data.map(item =>{
            if(props.category === "user"){
                resultBlock.push(
                    <div className="s-recent-div s-results" key={item.id}>
                        <img src={item.profile_pic} alt="" className="u-img" />
                        <div className="recent-identity">
                            <span className="u-name">{item.name}</span>
                            <span className="u-user">{item.username}</span>
                        </div>
                    </div>
                )
    
            }
            else{
                resultBlock.push(
                    <div className="s-recent-div s-results" key={item.id}>
                        <div className="hash-circle">
                            <FaHashtag className="hash-icon" />
                        </div>
                        <div className="recent-identity">
                            <span className="u-name">{item.phase}</span>
                        </div>
                    </div>
                )
    
            }
            return item
        })

    }
    else{
        resultBlock.push(
            <div className="no-recent">
                <sapn>
                No previous searches
                </sapn>

            </div>
            
        )
    }
    return(
        <React.Fragment>
            <div className="recent-search-div-top">
            <span className="heading">Search Results for {heading}</span>
            </div>
            <div className="recent-search-div">
                {resultBlock}
            </div>

        </React.Fragment>
        
    )
}