import { retrieveFromStorage, saveInStorage } from "../../utility/Utility";

const InitializeChatHistory =() =>{
    
    if(!('chatHistory' in localStorage)){
        saveInStorage("chatHistory", JSON.stringify([]))
    }
    if(!('openChats' in localStorage)){
        saveInStorage("openChats", JSON.stringify([]))
    }
}
    

export const GetChatRoomName = (usernames) =>{
    let allusers = usernames.sort();
    return allusers.join(":")
}

export const GetPreviousChats =(sockRoom, chatWithUser) =>{
    let existingChats = []
    let is_seen = false
    let chatHistory = JSON.parse( retrieveFromStorage('chatHistory'));
    if (chatHistory.length> 0){
        let targetRoom = chatHistory.filter(ele => ele.room === sockRoom)[0]
        if (targetRoom){
            let targetIndex = chatHistory.findIndex(ele => ele.room === sockRoom)
            existingChats = targetRoom.chats
            is_seen = targetRoom.is_seen
            chatHistory.splice(targetIndex, 1)
            chatHistory.unshift({room: sockRoom , chats: existingChats, otherUser: chatWithUser, is_seen: is_seen})

        }
        else{
            chatHistory.unshift({room: sockRoom , chats: [], otherUser: chatWithUser, is_seen: false})
        }
    }
    else{
        chatHistory = [{room: sockRoom , chats: [], otherUser: chatWithUser, is_seen: false}]
    }
    if (chatHistory.length > 8){
        chatHistory = chatHistory.slice(0, 8)
    }
    // save in localstorage
    saveInStorage("chatHistory", JSON.stringify(chatHistory))
    return [existingChats, is_seen]


}

export const StoreChat = (messageBody, sockRoom, chatWithUser, is_seen) =>{
    let chatHistory = JSON.parse(retrieveFromStorage('chatHistory'))
    if (chatHistory) {
        chatHistory.map(ele => {
            if(ele.room === sockRoom){
                ele.chats.push(messageBody);
                if(ele.chats.length > 10){
                    ele.chats = ele.chats.slice(-10)
                }
            }
            return ele
        })
    }
    else{
        chatHistory = [{room: sockRoom , chats: [messageBody], otherUser: chatWithUser, is_seen: is_seen} ]
    }
    saveInStorage("chatHistory", JSON.stringify(chatHistory))

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

export const UpdateSeenChat =(sockRoom)=>{
    try{
        let chatHistory = JSON.parse(retrieveFromStorage('chatHistory'));
        chatHistory.map(ele =>{
            if(ele.room === sockRoom){
                ele.is_seen = true
            }
            return ele
        })
        saveInStorage("chatHistory", JSON.stringify(chatHistory))

    }
    catch{}
    
}
export default InitializeChatHistory;