import React, {Component} from 'react';
import GoBack from "../GoBack";
import SearchBar from "./SearchBar";
import {FaHashtag} from "react-icons/fa";
import {AiFillCloseCircle} from 'react-icons/ai';

import pl2 from "../../assets/images/people/2.jpg";

export default class SearchHead extends Component {
    state = {
        searchDropDown : true,
        recentSearch : [
            {id:1,  phase: '#goodVibes', category: "hashtag"}, 
            {id:2,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:3,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:4,  "phase": '#goodVibes', "category": "hashtag"}, 
            {id:11,  phase: '#goodVibes', category: "hashtag"}, 
            {id:12,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:13,  username: 'milliebobbybrown', name:"millie Bobby Brown", category: "user", profile_pic: pl2 }, 
            {id:14,  "phase": '#goodVibes', "category": "hashtag"}, 
        ],
        newResult: []

    }

    searchBarSelected = () =>{
        this.setState({searchDropDown: !this.state.searchDropDown})
    }

    searchOnChange = () =>{

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

    fliterBy = () =>{

    }

    render(){
        let content = <RecentSearchPalette data={this.state.recentSearch} removeFromRecent={this.removeFromRecent} />
        return (
            <React.Fragment>
                <div className="srch-box">
                    <div className="back-div">
                        <GoBack />
                    </div>
                    <SearchBar searchDropDown={this.state.searchDropDown} 
                    searchBarSelected={this.searchBarSelected}
                    dropdownContent={content}
                    />
                </div>
    
            </React.Fragment>
        )

    }
    
}

function RecentSearchPalette(props){
    let resultBlock = [];
    if (props.data.length > 0){
        props.data.map(item =>{
            if(item.category === "user"){
                resultBlock.push(
                    <div className="s-recent-div">
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
                    <div className="s-recent-div">
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
