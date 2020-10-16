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
    let chatHistory = JSON.parse( retrieveFromStorage('chatHistory'));
    if (chatHistory.length> 0){
        let targetRoom = chatHistory.filter(ele => ele.room === sockRoom)[0]
        if (targetRoom){
            let targetIndex = chatHistory.findIndex(ele => ele.room === sockRoom)
            existingChats = targetRoom.chats
            chatHistory.splice(targetIndex, 1)
            chatHistory.unshift({room: sockRoom , chats: existingChats, otherUser: chatWithUser})

        }
        else{
            chatHistory.unshift({room: sockRoom , chats: [], otherUser: chatWithUser})
        }
    }
    else{
        chatHistory = [{room: sockRoom , chats: [], otherUser: chatWithUser}]
    }
    if (chatHistory.length > 8){
        chatHistory = chatHistory.slice(0, 8)
    }
    // save in localstorage
    saveInStorage("chatHistory", JSON.stringify(chatHistory))
    return existingChats


}

export const StoreChat = (messageBody, sockRoom, chatWithUser) =>{
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
        chatHistory = [{room: sockRoom , chats: [messageBody], otherUser: chatWithUser} ]
    }
    saveInStorage("chatHistory", JSON.stringify(chatHistory))

}

export const GetOpenChats =()=>{
    return JSON.parse(retrieveFromStorage("openChats"))
}
export const UpdateOpenChat =(recordSet) =>{
    saveInStorage("openChats", JSON.stringify(recordSet))

}
export default InitializeChatHistory;