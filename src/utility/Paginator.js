import HTTPRequestHandler from "./HTTPRequests";

export default class Paginator{
    constructor(count, prev, next, fetched){
        this.count = count;
        this.prev = prev;
        this.next = next;
        this.fetched =fetched
    }
    getNextPage(callBackFunc, resultsOnly=true, includeToken=true){
        if(this.fetched >= this.count || !this.next){
            return false
        }
        HTTPRequestHandler.get({url:this.next, completeUrl: true, includeToken: includeToken, callBackFunc: this.onNextCallback.bind(this, callBackFunc, resultsOnly) })
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

export const FillParentContainerSpace =(parentConatinerName, localcontainerName, storedPaginator, isFetchingFunc, updateFetchingFunc) =>{
    // check if container height is less than parent height(i.e sidebar size)
    let parentConainer = document.getElementById(parentConatinerName);
    let localContainer = document.getElementById(localcontainerName)
    while (parentConainer.offsetHeight> localContainer.offsetHeight){
        if (isFetchingFunc()) continue;
       //  console.log("localContainer.offsetHeight", localContainer.offsetHeight)
        if(storedPaginator && storedPaginator.next){
            storedPaginator.getNextPage(this.updateStateOnPagination)
            updateFetchingFunc(true)
        }
        else{
            break;
        }
    }

}