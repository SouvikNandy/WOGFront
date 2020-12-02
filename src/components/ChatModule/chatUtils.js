import { getCurrentTimeInMS, retrieveFromStorage, saveInStorage } from "../../utility/Utility";

let chatHistoryPaginator = {paginator: null, last_updated: null}

let roomTextpaginationHandler = {}

export const SetChatHistoryPaginator = (paginatorObj) =>{
    chatHistoryPaginator = {paginator: paginatorObj, last_updated: getCurrentTimeInMS()} 
}

export const GetChatHistoryPaginator = () =>{
    return chatHistoryPaginator
}

export const SetRoomTextPaginator = (roomName, paginatiorObj) =>{
    roomTextpaginationHandler[roomName] ={paginator: paginatiorObj, last_updated: getCurrentTimeInMS()}

}

export const GetRoomTextPaginator = (roomName)=>{
    if (roomName in roomTextpaginationHandler) return roomTextpaginationHandler[roomName]
    else return null
}

const InitializeChatHistory =() =>{
    if(!('openChats' in localStorage)){
        saveInStorage("openChats", JSON.stringify([]))
    }
}


export const GetChatRoomName = (usernames) =>{
    let allusers = usernames.sort();
    return allusers.join(":")
}

export const GetOpenChats =()=>{
    if(!('openChats' in localStorage)){
        saveInStorage("openChats", JSON.stringify([]))
        return []
    }
    else{
        return JSON.parse(retrieveFromStorage("openChats"))
    }
}

export const UpdateOpenChat =(recordSet) =>{
    saveInStorage("openChats", JSON.stringify(recordSet))

}


export default InitializeChatHistory;