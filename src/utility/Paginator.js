import HTTPRequestHandler from "./HTTPRequests";

export default class Paginator{
    constructor(count, prev, next, fetched){
        this.count = count;
        this.prev = prev;
        this.next = next;
        this.fetched =fetched
    }
    getNextPage(callBackFunc, resultsOnly=true){
        if(this.fetched >= this.count || !this.next){
            return false
        }
        HTTPRequestHandler.get({url:this.next, completeUrl: true, includeToken: true, callBackFunc: this.onNextCallback.bind(this, callBackFunc, resultsOnly) })
    }
    onNextCallback = (callBackFunc, resultsOnly, data) =>{
        this.count = data.count
        this.next = data.next
        this.prev = data.previous
        this.fetched = this.fetched + data.results.length
        if(resultsOnly){
            callBackFunc(data.results)
        }
        else{
            callBackFunc(data)
        }
        

    }
    getPrevPage(){
        // console.log("getPrevPage called")
    }

}