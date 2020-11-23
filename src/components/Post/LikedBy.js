import React, { Component } from 'react'
import { PostLikedByUsers, CommentLikedByUsersAPI } from '../../utility/ApiSet';
import Paginator, {FillParentContainerSpace} from '../../utility/Paginator';
import OwlLoader from '../OwlLoader';
import { UserFlat } from '../Profile/UserView';
import '../../assets/css/likedby.css'

export class LikedBy extends Component {
    state ={
        paginator: null,
        isFetching: false,
        data: null,

    }
    componentDidMount(){
        if(this.props.phase === "post"){
            PostLikedByUsers(this.props.post_id, this.updateStateOnAPIcall)

        }
        else if(this.props.phase === "comment"){
            CommentLikedByUsersAPI(this.props.post_id, this.props.comment_id, this.updateStateOnAPIcall)
        }
    }

    updateStateOnAPIcall = (data)=>{
        // paginated response
        let paginator = data.results.length < data.count? new Paginator(data.count, data.previous, data.next, data.results.length): null
        this.setState({
            data: data.results,
            paginator: paginator
        })
        if (paginator){
            FillParentContainerSpace("side-bar-content", "liked-container", this.state.paginator, 
            this.checkIfFetching, this.updateIfFeching, this.updateStateOnPagination)
        }
    }
    checkIfFetching = () => {
        return this.state.isFetching
    }

    updateIfFeching = (val) =>{
        this.setState({isFetching: val})
    }

    // fillParentContainerSpace = () =>{
    //      // check if container height is less than parent height(i.e sidebar size)
    //      let sideBar = document.getElementById("side-bar-content");
    //      let localContainer = document.getElementById("liked-container")
    //      while (sideBar.offsetHeight> localContainer.offsetHeight){
    //          if (this.state.isFetching) continue;
    //         //  console.log("localContainer.offsetHeight", localContainer.offsetHeight)
    //          if(this.state.paginator && this.state.paginator.next){
    //              this.state.paginator.getNextPage(this.updateStateOnPagination)
    //              this.setState({isFetching: true})
    //          }
    //          else{
    //              break;
    //          }
    //      }

    // }
    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if(this.state.isFetching) return;
        if(this.state.paginator && this.state.paginator.next){
            let res = this.state.paginator.getNextPage(this.updateStateOnPagination)
            if (res !== false){
                this.setState({isFetching: true})
            }  
        }
        
    }

    updateStateOnPagination = (results) =>{
        this.setState({
            data:[...this.state.data, ...results],
            isFetching: false
        })
    }
    render() {
        if(!this.state.data){
            return(<div className="loading"><OwlLoader/></div>)
        }
        let resultList = this.state.data.map(ele=> <UserFlat key={ele.username} data={ele}/>)
        return (
            <div className="liked-container" id="liked-container">
                {resultList}
            </div>
        )
    }
}

export default LikedBy
